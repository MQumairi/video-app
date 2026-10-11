import { Column, Entity, In, Index, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, getRepository } from "typeorm";
import { Tag } from "./tag";
import { PersistentQueryToPlaylist } from "./persistent_query_to_playlist";
import { MAX_RATING, MIN_RATING, SearchQuery } from "../lib/search_query";
import { VideoMeta } from "./video_meta";
import { VideoSearcher } from "../lib/videos_lib/video_searcher";

@Entity()
export class PersistentQuery {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column("text")
  name: string;

  @ManyToMany(() => Tag, (t) => t.persistent_queries, { eager: true, onDelete: "CASCADE" })
  included_tags: Tag[];

  @ManyToMany(() => Tag, (t) => t.excluded_persistent_queries, { eager: true, onDelete: "CASCADE" })
  excluded_tags: Tag[];

  @ManyToMany(() => Tag, (t) => t.studio_persistent_queries, { eager: true, onDelete: "CASCADE" })
  studios: Tag[];

  @ManyToMany(() => Tag, (t) => t.fairness_persistent_queries, { eager: true, onDelete: "CASCADE" })
  fairness_tags: Tag[];

  @Column("text")
  search_text: string;

  @Column("int", { default: 0 })
  min_rating: number;

  @Column("int", { default: 0 })
  max_rating: number;

  @Column("decimal", { default: 0 })
  min_duration_sec: number;

  @Column("decimal", { default: 0 })
  max_duration_sec: number;

  @Column("decimal", { default: 0 })
  frame_height: number;

  @OneToMany(() => PersistentQueryToPlaylist, (pqp) => pqp.playlist)
  persistent_query_to_playlists: PersistentQueryToPlaylist[];

  // Templates hold configuration shared by other queries. They can be previewed, but can't be
  // assigned to playlists.
  @Column("boolean", { default: false })
  is_template: boolean;

  @Column("int", { nullable: true })
  template_id: number | null;

  @ManyToOne(() => PersistentQuery, (pq) => pq.template_children, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "template_id" })
  template: PersistentQuery | null;

  @OneToMany(() => PersistentQuery, (pq) => pq.template)
  template_children: PersistentQuery[];

  // Not persisted: the template's search text, carried by a query returned from resolve().
  inherited_search_text?: string;

  static create(
    name: string,
    included_tags: Tag[] = [],
    excluded_tags: Tag[] = [],
    studios: Tag[] = [],
    min_rating: number = MIN_RATING,
    max_rating: number = MAX_RATING,
    min_duration: number = 0,
    max_duration: number = 9999999,
    quality: number = 2160,
    fairness_tags: Tag[] = []
  ): PersistentQuery {
    const persistent_query = new PersistentQuery();
    persistent_query.name = name;
    persistent_query.included_tags = included_tags;
    persistent_query.excluded_tags = excluded_tags;
    persistent_query.studios = studios;
    persistent_query.fairness_tags = fairness_tags;
    persistent_query.min_rating = min_rating;
    persistent_query.max_rating = max_rating;
    persistent_query.min_duration_sec = min_duration;
    persistent_query.max_duration_sec = max_duration;
    persistent_query.frame_height = quality;
    return persistent_query;
  }

  static async build_search_query(p: PersistentQuery): Promise<SearchQuery> {
    const search_query = new SearchQuery(p.search_text ?? "", p.included_tags, p.excluded_tags, p.min_rating, p.max_rating, p.frame_height, p.studios, p.fairness_tags ?? []);
    if (p.inherited_search_text) search_query.additional_searched_texts = [p.inherited_search_text];
    return search_query;
  }

  // Returns the query with its template's configuration merged in (see merge_template).
  static async resolve(query: PersistentQuery): Promise<PersistentQuery> {
    const template_id = query.template_id !== undefined ? query.template_id : query.template?.id;
    if (query.is_template || !template_id) return query;
    const template = await getRepository(PersistentQuery).findOne(template_id);
    if (!template || !template.is_template) return query;
    return PersistentQuery.merge_template(query, template);
  }

  // Returns an in-memory copy of the query with the template's configuration merged in. Tag lists
  // are combined, numeric bounds take the stricter value, both search texts must match, and the
  // query's own studios replace the template's (the template's apply only if the query has none).
  static merge_template(query: PersistentQuery, template: PersistentQuery): PersistentQuery {
    const resolved = Object.assign(new PersistentQuery(), query);
    resolved.included_tags = PersistentQuery.unique_tags([...(template.included_tags ?? []), ...(query.included_tags ?? [])]);
    resolved.excluded_tags = PersistentQuery.unique_tags([...(template.excluded_tags ?? []), ...(query.excluded_tags ?? [])]);
    resolved.fairness_tags = PersistentQuery.unique_tags([...(template.fairness_tags ?? []), ...(query.fairness_tags ?? [])]);
    resolved.studios = query.studios && query.studios.length > 0 ? query.studios : template.studios ?? [];
    resolved.min_rating = Math.max(+template.min_rating, +query.min_rating);
    resolved.max_rating = Math.min(+template.max_rating, +query.max_rating);
    resolved.frame_height = Math.max(+template.frame_height, +query.frame_height);
    resolved.min_duration_sec = Math.max(+template.min_duration_sec, +query.min_duration_sec);
    resolved.max_duration_sec = Math.min(+template.max_duration_sec, +query.max_duration_sec);
    if (template.search_text && template.search_text.length > 0) {
      if (!query.search_text || query.search_text.length === 0) resolved.search_text = template.search_text;
      else if (query.search_text !== template.search_text) resolved.inherited_search_text = template.search_text;
    }
    return resolved;
  }

  // Returns why the query can't inherit from the template of the given id, or null if it can.
  static async template_assignment_error(query: PersistentQuery, template_id: number | null | undefined): Promise<string | null> {
    if (template_id === null || template_id === undefined) return null;
    if (query.is_template) return "A template can't inherit from another template";
    if (query.id !== undefined && query.id === template_id) return "A query can't inherit from itself";
    const template = await getRepository(PersistentQuery).findOne(template_id);
    if (!template) return `Template of id ${template_id} not found`;
    if (!template.is_template) return `Query of id ${template_id} is not a template`;
    return null;
  }

  // Returns why the submitted queries can't be assigned to a playlist, or null if they can.
  // Queries are read from the database by id, so the client can't claim a template isn't one.
  static async playlist_assignment_error(queries: PersistentQuery[] = []): Promise<string | null> {
    const ids = queries.map((q) => q.id).filter((id) => id !== undefined && id !== -1);
    if (ids.length === 0) return null;
    const templates = await getRepository(PersistentQuery).find({ where: { id: In(ids), is_template: true } });
    if (templates.length === 0) return null;
    return `Templates can't be assigned to a playlist: ${templates.map((t) => t.name).join(", ")}`;
  }

  static async find_video(unresolved_query: PersistentQuery): Promise<VideoMeta | null> {
    console.log("fiding video for query:", unresolved_query);
    // Templates can't be executed
    if (unresolved_query.is_template) return null;
    const query = await PersistentQuery.resolve(unresolved_query);
    const fairness_tags = query.fairness_tags ?? [];
    // No fairness tags: pick a random video uniformly across the whole result set (legacy behavior).
    if (fairness_tags.length === 0) {
      const search_query = await PersistentQuery.build_search_query(query);
      const video = await new VideoSearcher(search_query).random_single_video();
      return video ?? null;
    }
    // Fairness tags: pick one fairness tag at random, then a random video having the search
    // tags AND that fairness tag. Shuffling and taking the first non-empty branch keeps
    // selection uniform across the populated fairness tags while skipping empty ones.
    for (const fairness_tag of PersistentQuery.shuffle(fairness_tags)) {
      const search_query = await PersistentQuery.build_search_query(query);
      search_query.included_tags = [...query.included_tags, fairness_tag];
      search_query.fairness_tags = [];
      const video = await new VideoSearcher(search_query).random_single_video();
      if (video) return video;
    }
    return null;
  }

  private static shuffle<T>(items: T[]): T[] {
    const shuffled = [...items];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  static async find_videos(query: PersistentQuery): Promise<VideoMeta[]> {
    if (query.is_template) return [];
    const search_query = await PersistentQuery.build_search_query(await PersistentQuery.resolve(query));
    const media_searcher = new VideoSearcher(search_query);
    const [videos, _] = await media_searcher.random_videos();
    return videos;
  }

  static async find_by_order(playlist: Tag, order: number): Promise<PersistentQuery[]> {
    const pq2p_arr = await PersistentQueryToPlaylist.find_by_order(playlist, order);
    return pq2p_arr.map((pq2p) => {
      return pq2p.persistent_query;
    });
  }

  static async all_playlist_queries(playlist: Tag): Promise<PersistentQuery[]> {
    const pq2p_arr = await PersistentQueryToPlaylist.generate_playlist_p2ps(playlist);
    return pq2p_arr.map((pq2p) => {
      return pq2p.persistent_query;
    });
  }

  add_included_tags(tags: Tag[]) {
    this.included_tags = PersistentQuery.unique_tags([...this.included_tags, ...tags]);
  }

  private static unique_tags(tags: Tag[]): Tag[] {
    const seen_tag_ids = new Set<number>();
    const unique_tags: Tag[] = [];
    for (const t of tags) {
      if (seen_tag_ids.has(t.id)) continue;
      seen_tag_ids.add(t.id);
      unique_tags.push(t);
    }
    return unique_tags;
  }
}
