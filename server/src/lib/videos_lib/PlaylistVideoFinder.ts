import { PersistentQuery } from "../../models/persistent_query";
import { Tag } from "../../models/tag";
import { VideoMeta } from "../../models/video_meta";

export class PlaylistVideoFinder {
  static async find_video(playlist: Tag, order: number): Promise<VideoMeta | undefined> {
    const query = await this.find_query(playlist, order);
    if (!query) return undefined;
    return await PersistentQuery.find_video(query);
  }

  static async find_all_videos(playlist: Tag): Promise<VideoMeta[]> {
    const queries = await PersistentQuery.all_playlist_queries(playlist);
    const videos: VideoMeta[] = [];
    for (const q of queries) {
      const video = await PersistentQuery.find_video(q);
      if (video) videos.push(video);
    }
    return videos;
  }

  static find_video_or_next(playlist: Tag, order: number): VideoMeta | null {
    const sought_video = await this.find_video(playlist, order);

    return null;
  }

  private static async find_query(playlist: Tag, order: number): Promise<PersistentQuery | null> {
    const persistent_queries = await PersistentQuery.find_by_order(playlist, order);
    if (persistent_queries.length == 0) return null;
    return persistent_queries[0];
  }
}
