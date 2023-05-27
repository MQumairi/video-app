import { Repository, getRepository } from "typeorm";
import { Request, Response } from "express";
import { VideoMeta } from "../../models/video_meta";
import { existsSync } from "fs";
import { ImageGallery } from "../../models/image_gallery";

const CleanupDatabase = async (req: Request, res: Response): Promise<void> => {
  console.log("cleaning database from missing videos");
  let video_repo = getRepository(VideoMeta);
  let videos = await video_repo.find({ relations: ["file_scripts", "gallery"] });
  let result = new Map<string, boolean>();
  const counter = { deleted: 0, kept: 0 };
  for (let v of videos) {
    console.log(`checking videos ${v.id}`);
    let path_exists = existsSync(v.path);
    result.set(v.name, path_exists);
    if (!path_exists) {
      console.log(`deleting video ${v.id}`);
      await delete_video(v, video_repo);
      counter.deleted += 1;
    } else {
      counter.kept += 1;
    }
  }
  console.log("done cleanup missing videos:", counter);
  res.status(200).json(Object.fromEntries(result));
};

const delete_video = async (v: VideoMeta, video_repo: Repository<VideoMeta>) => {
  if (v.gallery) {
    await ImageGallery.delete_gallery(v.gallery);
  }
  await video_repo.remove(v);
};

export default CleanupDatabase;
