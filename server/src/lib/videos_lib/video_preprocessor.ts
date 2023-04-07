import { existsSync } from "fs";
import { FileScript } from "../../models/file_script";
import { VideoMeta } from "../../models/video_meta";
import { getRepository } from "typeorm";

export class VideoPreprocessor {
  static async preprocess(video: VideoMeta): Promise<boolean> {
    if (!existsSync(video.path)) {
      const video_repo = getRepository(VideoMeta);
      console.log("❌ Video file doesn't exist. Removing from database");
      await video_repo.remove(video);
      return false;
    }
    await VideoPreprocessor.execute_start_scripts(video);
    return true;
  }

  static async execute_start_scripts(video: VideoMeta) {
    if (!video.file_scripts || video.file_scripts.length === 0) return;
    for (const script of video.file_scripts) {
      if (script.is_start_script) await FileScript.execute_script(script, video.path);
    }
  }
}
