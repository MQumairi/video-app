import { Column, Entity, Index, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
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
    min_rating: number = MIN_RATING,
    max_rating: number = MAX_RATING,
    min_duration: number = 0,
    max_duration: number = 9999999,
    quality: number = 2160
  ): PersistentQuery {
    const persistent_query = new PersistentQuery();
    persistent_query.name = name;
    persistent_query.included_tags = included_tags;
    persistent_query.excluded_tags = excluded_tags;
    persistent_query.min_rating = min_rating;
    persistent_query.max_rating = max_rating;
    persistent_query.min_duration_sec = min_duration;
    persistent_query.max_duration_sec = max_duration;
    persistent_query.frame_height = quality;
    return persistent_query;
  }

  static build_search_query(p: PersistentQuery): SearchQuery {
    return new SearchQuery(p.search_text, p.included_tags, p.excluded_tags, p.min_rating, p.max_rating, p.frame_height);
  }

  static async find_video(query: PersistentQuery): Promise<VideoMeta | undefined> {
    const search_query = PersistentQuery.build_search_query(query);
    const media_searcher = new VideoSearcher(search_query);
    return await media_searcher.random_single_video();
  }

  static async find_videos(query: PersistentQuery): Promise<VideoMeta[]> {
    const search_query = PersistentQuery.build_search_query(query);
    const media_searcher = new VideoSearcher(search_query);
    const [videos, _] = await media_searcher.random_videos();
    return videos;
  }
}
