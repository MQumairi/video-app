import { Directory } from "./directory";
import { VideoMeta } from "../models/video_meta";
import glob from "glob";
import { FileScript } from "../models/file_script";

export default class LibraryIterator {
  // Iterate over entire library, for each video found, perform callback function
  static async iterate_videos(callback: (video: VideoMeta) => Promise<void>): Promise<void> {
    const glob_patterns = Directory.video_extensions.map((ext) => {
      return `**/*${ext}`;
    });
    const video_files = await glob(glob_patterns);
    for (let video_path of video_files) {
      const video = VideoMeta.create_from_path(video_path);
      await callback(video);
    }
  }

  // Iterate over entire library, for each script found, perform callback function
  static async iterate_scripts(callback: (script: FileScript) => Promise<void>): Promise<void> {
    const script_files = await glob("./scripts/*.sh");
    for (let script_path of script_files) {
      const script = FileScript.create_from_path(script_path);
      await callback(script);
    }
  }
}
