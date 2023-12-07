import { PersistentQuery } from "../../../models/persistent_query";
import { Playlist } from "../../../models/playlist";
import { VideoMeta } from "../../../models/video_meta";
import { PlaylistVideoFinderResult } from "./models/playist_video_finder_result";
import { PlaylistQueryVideoPair } from "./models/playlist_query_video_pair";
import { PlaylistCleaner } from "./playlist_cleaner";
import { PlaylistSearcher } from "./playlist_searcher";

export class PlaylistVideoSearcher {
  static async find_video(playlist: Playlist, order: number): Promise<PlaylistVideoFinderResult | null> {
    const query = await PlaylistSearcher.find_query(playlist, order);
    if (!query) return null;
    const video = await this.find_query_video(playlist, query);
    if (!video) return null;
    const playlist_length = await this.get_playlist_length(playlist);
    const qv = new PlaylistQueryVideoPair(video, query, order);
    return new PlaylistVideoFinderResult(qv, order, playlist_length);
  }

  static async find_video_or_next(playlist: Playlist, order: number): Promise<PlaylistVideoFinderResult | null> {
    // try to find video with correct order
    console.log("entered find_video_or_next");
    const sought_result = await this.find_video(playlist, order);
    if (sought_result && sought_result.video) {
      console.log("found sought_result");
      return sought_result;
    }
    console.log("failed to find sought result... cleaning");
    // if no video for result found, cleanup...
    await PlaylistCleaner.clean_query_orders(playlist);
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

  private static async find_queries_and_videos(playlist: Playlist): Promise<PlaylistQueryVideoPair[]> {
    const queries = await PlaylistSearcher.find_all_queries(playlist);
    const queries_and_videos: PlaylistQueryVideoPair[] = [];
    for (let i = 0; i < queries.length; i++) {
      const q = queries[i];
      const v = await this.find_query_video(playlist, q);
      queries_and_videos.push(new PlaylistQueryVideoPair(v, q, i));
    }
    return queries_and_videos;
  }

  private static async get_playlist_length(playlist: Playlist) {
    return (await PlaylistSearcher.find_all_queries(playlist)).length;
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

  private static async find_query_video(playlist: Playlist, query: PersistentQuery): Promise<VideoMeta | null> {
    console.log("playlist includes:", playlist.included_tags);
    query.included_tags.push(...playlist.included_tags);
    return await PersistentQuery.find_video(query);
  }
}
