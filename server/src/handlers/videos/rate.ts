import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { VideoMeta } from "../../models/video_meta";

const Rate = async (req: Request, res: Response): Promise<VideoMeta | undefined> => {
  const filepath = req.params.filepath;
  const videoMetaRepo = getRepository(VideoMeta);
  let video = await videoMetaRepo.findOne({ where: { path: filepath } });
  if (!video) {
    video = new VideoMeta(filepath);
    if (!video) return undefined;
  }
  video.rating = req.body.rating ?? 0;
  return await videoMetaRepo.save(video);
};

export default Rate;
