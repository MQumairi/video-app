import { PersistentQuery } from "../../../../models/persistent_query";
import { VideoMeta } from "../../../../models/video_meta";

export class PlaylistQueryVideoPair {
  video: VideoMeta | null;
  persistent_query: PersistentQuery | null;
  index: number;
  constructor(video: VideoMeta | null, query: PersistentQuery | null, index: number) {
    this.video = video;
    this.persistent_query = query;
    this.index = index;
  }
}
