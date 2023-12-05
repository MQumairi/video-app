import { PersistentQuery } from "../../models/persistent_query";
import { Tag } from "../../models/tag";
import { VideoMeta } from "../../models/video_meta";

export class PlaylistVideoFinder {
  static async find_video(playlist: Tag, order: number): Promise<PlaylistVideoFinderResult | null> {
    const query = await this.find_query(playlist, order);
    console.log("query:", query);
    if (!query) return null;
    const video = await this.find_query_video(playlist, query);
    console.log("video:", video);
    if (!video) return null;
    const playlist_length = await this.get_playlist_length(playlist);
    const qv = new PlaylistQueryVideoPair(video, query, order);
    return new PlaylistVideoFinderResult(qv, order, playlist_length);
  }

  static async find_video_or_next(playlist: Tag, order: number): Promise<PlaylistVideoFinderResult | null> {
    // try to find video with correct order
    console.log("entered find_video_or_next");
    const sought_result = await this.find_video(playlist, order);
    if (sought_result && sought_result.video) {
      console.log("found sought_result");
      return sought_result;
    }
    console.log("failed to find sought result... cleaning");
    // if no video for result found, cleanup...
    await Tag.update_dynamic_playlist_query_orders(playlist);
    // then try to find the first video in playlist after index order
    const playlist_length = await this.get_playlist_length(playlist);
    const queries_and_videos = await this.find_queries_and_videos(playlist);
    let valid_qv_pair = this.find_first_valid_qv_pair(queries_and_videos, order, queries_and_videos.length);
    console.log("after first search, valid_qv_pair:", valid_qv_pair);
    if (valid_qv_pair) {
      return new PlaylistVideoFinderResult(valid_qv_pair, valid_qv_pair.index + 1, playlist_length);
    }
    // if no video for result found, try to find the first video in playlist from the start
    valid_qv_pair = this.find_first_valid_qv_pair(queries_and_videos, 0, order);
    if (valid_qv_pair) {
      return new PlaylistVideoFinderResult(valid_qv_pair, valid_qv_pair.index + 1, playlist_length);
    }
    console.log("after second search, valid_qv_pair:", valid_qv_pair);
    return null;
  }

  private static async find_query(playlist: Tag, order: number): Promise<PersistentQuery | null> {
    const persistent_queries = await PersistentQuery.find_by_order(playlist, order);
    if (persistent_queries.length == 0) return null;
    return persistent_queries[0];
  }

  private static async find_queries_and_videos(playlist: Tag): Promise<PlaylistQueryVideoPair[]> {
    const queries = await PersistentQuery.all_playlist_queries(playlist);
    const queries_and_videos: PlaylistQueryVideoPair[] = [];
    for (let i = 0; i < queries.length; i++) {
      const q = queries[i];
      const v = await this.find_query_video(playlist, q);
      queries_and_videos.push(new PlaylistQueryVideoPair(v, q, i));
    }
    return queries_and_videos;
  }

  private static async get_playlist_length(playlist: Tag) {
    return (await Tag.get_dynamic_playlist_queries(playlist)).length;
  }

  private static find_first_valid_qv_pair(qvs: PlaylistQueryVideoPair[], lower_bound: number, upper_bound: number): PlaylistQueryVideoPair | null {
    for (let i = lower_bound; i < upper_bound; i++) {
      const qv_pair = qvs[i];
      const q = qv_pair.persistent_query;
      const v = qv_pair.video;
      console.log(`i: ${i}, q: ${q?.name}, v: ${v?.name}`);
      if (q && v) return qv_pair;
    }
    return null;
  }

  private static async find_query_video(playlist: Tag, query: PersistentQuery): Promise<VideoMeta | null> {
    query.included_tags.push(...playlist.playlist_included_tags);
    return await PersistentQuery.find_video(query);
  }
}

class PlaylistVideoFinderResult {
  video: VideoMeta;
  persistent_query: PersistentQuery;
  order: number;
  next_video_index: number;
  playlist_length: number;

  constructor(query_video_pair: PlaylistQueryVideoPair, order: number, playlist_length: number) {
    this.video = query_video_pair.video ?? new VideoMeta();
    this.persistent_query = query_video_pair.persistent_query ?? new PersistentQuery();
    this.order = order;
    this.next_video_index = PlaylistVideoFinderResult.calculate_next_video_index(order, playlist_length);
    this.playlist_length = playlist_length;
  }

  private static calculate_next_video_index(order: number, playlist_length: number) {
    if (order + 1 <= playlist_length) return order + 1;
    return 1;
  }
}

class PlaylistQueryVideoPair {
  video: VideoMeta | null;
  persistent_query: PersistentQuery | null;
  index: number;
  constructor(video: VideoMeta | null, query: PersistentQuery | null, index: number) {
    this.video = video;
    this.persistent_query = query;
    this.index = index;
  }
}
