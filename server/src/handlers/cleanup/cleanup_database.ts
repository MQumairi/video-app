import { getRepository } from "typeorm";
import { Request, Response } from "express";
import { VideoMeta } from "../../models/video_meta";
import { existsSync } from "fs";

const CleanupDatabase = async (req: Request, res: Response): Promise<void> => {
  console.log("cleaning database from missing videos");
  let video_repo = getRepository(VideoMeta);
  let videos = await video_repo.find({ relations: ["scripts"] });
  let result = new Map<string, boolean>();
  for (let v of videos) {
    if (v.scripts && v.scripts.length > 0) {
      console.log(`${v.id} has a script. Not deleting.`);
      continue;
    }
    console.log(`checking videos ${v.id}`);
    let path_exists = existsSync(v.path);
    result.set(v.name, path_exists);
    if (!path_exists) {
      console.log(`deleting video ${v.id}`);
      await video_repo.remove(v);
    }
  }
  console.log("done cleanup missing videos");
  res.status(200).json(Object.fromEntries(result));
};

export default CleanupDatabase;
