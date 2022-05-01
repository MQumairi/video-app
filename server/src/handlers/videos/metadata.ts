import { Request, Response } from "express";
import { VideoMeta } from "../../models/video_meta";
import { Directory } from "../../models/directory";
import { not_found_error } from "../../app";
import { getRepository } from "typeorm";

const Metadata = async (req: Request, res: Response): Promise<VideoMeta | undefined> => {
  const vid_path = req.params.filepath;
  if (!Directory.is_video(vid_path)) {
    res.status(404).send(not_found_error);
    return undefined;
  }
  let vid_meta = new VideoMeta(vid_path);
  const video_repo = getRepository(VideoMeta);
  const found_video = await video_repo.findOne({ relations: ["tags"], where: { name: vid_meta.name } });
  if (found_video) {
    res.status(200).send(found_video);
    return found_video;
  }
  res.status(200).send(vid_meta);
  return vid_meta;
};

export default Metadata;
