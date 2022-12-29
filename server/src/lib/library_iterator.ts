import { Directory } from "./directory";
import { VideoMeta } from "../models/video_meta";

export default class LibraryIterator {
  // Iterate over entire library, for each video found, perform callback function
  static async iterate(callback: (video: VideoMeta) => Promise<void>): Promise<void> {
    let dir = new Directory("./videos");
    let queue = await dir.list_directory_paths();
    let seen = new Set<string>();
    let iterated = 0;
    for (let d of queue) {
      if (seen.has(d)) continue;
      seen.add(d);
      let subdir = new Directory(d);
      for (let v of await subdir.list_video_paths()) {
        console.log("seen", iterated, "videos");
        iterated++;
        callback(v);
      }
      for (let sd of await subdir.list_directory_paths()) {
        queue.push(sd);
      }
    }
  }
}
