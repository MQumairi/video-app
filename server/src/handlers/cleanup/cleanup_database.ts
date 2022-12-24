import { getRepository } from "typeorm";
import { Request, Response } from "express";
import { VideoMeta } from "../../models/video_meta";
import { existsSync } from "fs";

const CleanupDatabase = async (req: Request, res: Response): Promise<void> => {
  let video_repo = getRepository(VideoMeta);
  let videos = await video_repo.find();
  let result = new Map<string, boolean>();
  for (let v of videos) {
    let path_exists = existsSync(v.path);
    result.set(v.name, path_exists);
    if (!path_exists) {
      await video_repo.remove(v);
    }
  }
  res.status(200).json(Object.fromEntries(result));
};

export default CleanupDatabase;
