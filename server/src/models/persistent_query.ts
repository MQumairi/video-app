import { Column, Entity, Index, ManyToMany, OneToMany, PrimaryGeneratedColumn, getRepository } from "typeorm";
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
    return new SearchQuery(p.search_text, p.included_tags, p.excluded_tags, p.min_rating, p.max_rating, p.frame_height, p.studios, p.fairness_tags ?? []);
  }

  static async find_video(query: PersistentQuery): Promise<VideoMeta | null> {
    console.log("fiding video for query:", query);
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
    const search_query = await PersistentQuery.build_search_query(query);
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
    const seen_tag_ids = new Set<number>();
    const all_tags: Tag[] = [...this.included_tags, ...tags];
    const new_included_tags: Tag[] = [];
    for (const t of all_tags) {
      if (seen_tag_ids.has(t.id)) continue;
      seen_tag_ids.add(t.id);
      new_included_tags.push(t);
    }
    this.included_tags = new_included_tags;
  }
}
