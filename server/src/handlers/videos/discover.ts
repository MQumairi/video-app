import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { VideoMeta } from "../../models/video_meta";
import { ImagePreprocessor } from "../../lib/images_lib/image_preprocessor";

const Discover = async (req: Request, res: Response): Promise<VideoMeta[]> => {
  const video_repo = getRepository(VideoMeta);
  const random_videos = await video_repo
    .createQueryBuilder("video")
    .addGroupBy("video.id")
    .leftJoinAndSelect("video.thumbnail", "thumbnail")
    .leftJoinAndSelect("thumbnail.file_scripts", "file_script")
    .addGroupBy("thumbnail.id")
    .addGroupBy("file_script.id")
    .orderBy("RANDOM()")
    .limit(6)
    .getMany();
  await ImagePreprocessor.process_video_thumbs(random_videos);
  res.status(200).send(random_videos);
  return random_videos;
};

export default Discover;
