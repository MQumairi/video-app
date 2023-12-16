import { PersistentQuery } from "../../../../models/persistent_query";
import { VideoMeta } from "../../../../models/video_meta";
import { PlaylistQueryVideoPair } from "./playlist_query_video_pair";

export class PlaylistVideoFinderResult {
  video: VideoMeta;
  persistent_query: PersistentQuery;
  order: number;
  next_video_index: number;
  playlist_length: number;
  playlist_name: string;

  constructor(query_video_pair: PlaylistQueryVideoPair, order: number, playlist_length: number, playlist_name: string) {
    this.video = query_video_pair.video ?? new VideoMeta();
    this.persistent_query = query_video_pair.persistent_query ?? new PersistentQuery();
    this.order = order;
    this.next_video_index = PlaylistVideoFinderResult.calculate_next_video_index(order, playlist_length);
    this.playlist_length = playlist_length;
    this.playlist_name = playlist_name;
  }

  private static calculate_next_video_index(order: number, playlist_length: number) {
    if (order + 1 <= playlist_length) return order + 1;
    return 1;
  }
}
