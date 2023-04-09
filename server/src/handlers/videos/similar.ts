import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { VideoMeta } from "../../models/video_meta";
import { ImagePreprocessor } from "../../lib/images_lib/image_preprocessor";

const Similar = async (req: Request, res: Response): Promise<VideoMeta[]> => {
  console.log("entered similar");
  const id = +req.params.id;
  const video_repo = getRepository(VideoMeta);
  const video = await video_repo.findOne(+id);
  if (!video) {
    res.status(404).send({ message: "video not found" });
    return [];
  }
  const similar_videos = await video_repo.find({ where: { parent_path: video.parent_path }, relations: ["file_scripts", "thumbnail"], order: { name: "ASC" } });
  await ImagePreprocessor.process_video_thumbs(similar_videos);
  res.status(200).send(similar_videos);
  return similar_videos;
};

export default Similar;
