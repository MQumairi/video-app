import { Request, Response } from "express";
import { VideoMeta } from "../../models/video_meta";
import { Directory } from "../../models/directory";
import { not_found_error } from "../../app";
import { getRepository } from "typeorm";
import { existsSync } from "fs";

const get_video_meta = async (req: Request, res: Response): Promise<VideoMeta | undefined> => {
  console.log("entered get_video_meta");
  const vid_path = req.params.filepath;
  let vid_meta = new VideoMeta(vid_path);
  const video_repo = getRepository(VideoMeta);
  const found_video = await video_repo.findOne({ relations: ["tags", "series"], where: { path: vid_meta.path } });
  console.log("found:", found_video);
  if (found_video) {
    console.log("found in db");
    if (!existsSync(found_video.path)) {
      console.log("video path doesn't exist. Removing from database");
      await video_repo.remove(found_video);
      res.status(404).send(not_found_error);
      return undefined;
    }
    res.status(200).send(found_video);
    return found_video;
  }
  console.log("did not find in db");
  if (!Directory.is_video(vid_path)) {
    res.status(404).send(not_found_error);
    return undefined;
  }
  res.status(200).send(vid_meta);
  return vid_meta;
};

const Metadata = async (req: Request, res: Response): Promise<VideoMeta | undefined> => {
  try {
    return await get_video_meta(req, res);
  } catch (error) {
    console.log("error is:", error);
  }
};

export default Metadata;
