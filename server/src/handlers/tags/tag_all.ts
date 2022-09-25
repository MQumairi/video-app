import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Directory } from "../../models/directory";
import { VideoMeta } from "../../models/video_meta";

const TagAll = async (req: Request, res: Response): Promise<void> => {
  let dir = new Directory("./videos");
  let queue = await dir.list_directory_paths();
  let seen = new Set<string>();
  let old = 0;
  let additions = 0;
  let iterated = 0;
  for (let d of queue) {
    if (seen.has(d)) continue;
    seen.add(d);
    let subdir = new Directory(d);
    for (let v of await subdir.list_video_paths()) {
      console.log("seen", iterated, "videos");
      iterated++;
      const repo = getRepository(VideoMeta);
      const found_video = await repo.findOne({ where: { path: v.path } });
      if (found_video) {
        old++;
      } else {
        additions++;
        await repo.save(v);
      }
    }
    for (let sd of await subdir.list_directory_paths()) {
      queue.push(sd);
    }
  }
  res.status(200).json({ message: "done", old: old, addition: additions });
};

export default TagAll;
