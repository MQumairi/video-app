import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { VideoMeta } from "../../models/video_meta";
import { ImagePreprocessor } from "../../lib/images_lib/image_preprocessor";

const Popular = async (req: Request, res: Response): Promise<VideoMeta[]> => {
  const video_repo = getRepository(VideoMeta);
  const popular_videos = await video_repo
    .createQueryBuilder("video")
    .addGroupBy("video.id")
    .leftJoinAndSelect("video.thumbnail", "thumbnail")
    .leftJoinAndSelect("thumbnail.file_scripts", "file_script")
    .addGroupBy("thumbnail.id")
    .addGroupBy("file_script.id")
    .where("video.rating >= 8")
    .orderBy("RANDOM()")
    .limit(6)
    .getMany();
  await ImagePreprocessor.process_video_thumbs(popular_videos);
  res.status(200).send(popular_videos);
  return popular_videos;
};

export default Popular;
