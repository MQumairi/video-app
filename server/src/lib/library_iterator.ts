import { Directory } from "./directory";
import { VideoMeta } from "../models/video_meta";
import { VideoScript } from "../models/video_script";
import { ScriptManager } from "./script_manager";

export default class LibraryIterator {
  // Iterate over entire library, for each video found, perform callback function
  static async iterate(callback: (video: VideoMeta, scripts: VideoScript[]) => Promise<void>): Promise<void> {
    const queue = [new Directory("./videos")];
    let seen = new Set<string>();
    for (let d of queue) {
      if (seen.has(d.path)) continue;
      await d.read_contents();
      seen.add(d.path);
      await ScriptManager.create_scripts(d.scripts);
      for (let v of d.video_paths) {
        await callback(v, d.scripts);
      }
      for (let sd of d.directory_paths) {
        queue.push(sd);
      }
    }
  }
}
