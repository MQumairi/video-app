import { Request, Response } from "express";
import { IsNull, Not, getRepository } from "typeorm";
import { VideoMeta } from "../../models/video_meta";
import { ImagePreprocessor } from "../../lib/images_lib/image_preprocessor";

const Latest = async (req: Request, res: Response): Promise<VideoMeta[]> => {
  const video_repo = getRepository(VideoMeta);
  const latest_videos = await video_repo.find({ where: { created_at: Not(IsNull()) }, order: { created_at: "DESC" }, take: 6 });
  await ImagePreprocessor.process_video_thumbs(latest_videos);
  res.status(200).send(latest_videos);
  return latest_videos;
};

export default Latest;
