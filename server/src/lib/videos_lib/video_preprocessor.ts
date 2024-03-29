import { existsSync } from "fs";
import { FileScript } from "../../models/file_script";
import { VideoMeta } from "../../models/video_meta";
import { getRepository } from "typeorm";

export class VideoPreprocessor {
  static async preprocess(video: VideoMeta): Promise<boolean> {
    if (!existsSync(video.path) && !VideoMeta.has_scripts(video)) {
      const video_repo = getRepository(VideoMeta);
      console.log("❌ Video file doesn't exist. Removing from database");
      await video_repo.remove(video);
      return false;
    }
    await VideoPreprocessor.execute_start_scripts(video);
    // Don't await as this doesn't need to block
    VideoPreprocessor.increment_views(video);
    return true;
  }

  static async execute_start_scripts(video: VideoMeta) {
    if (!VideoMeta.has_scripts(video)) return;
    for (const script of video.file_scripts) {
      if (script.is_start_script) await FileScript.execute_script(script, video.path);
    }
  }

  static async increment_views(video: VideoMeta) {
    video.views += 1;
    await getRepository(VideoMeta).save(video);
  }
}
