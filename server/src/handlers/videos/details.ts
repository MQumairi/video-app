import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { VideoMeta } from "../../models/video_meta";
import { VideoPreprocessor } from "../../lib/videos_lib/video_preprocessor";

const Details = async (req: Request, res: Response): Promise<VideoMeta | undefined> => {
  console.log("getting video from id...");
  const id = +req.params.id;
  if (isNaN(+id)) {
    console.log("invalid input...");
    res.status(404).send({ message: `invalid input provided, ${id} is NAN` });
    return;
  }
  const video_repo = getRepository(VideoMeta);
  const video = await video_repo.findOne(id, { relations: ["file_scripts"] });
  if (!video) {
    res.status(404).send({ message: "video not found in database" });
    return;
  }
  const preproces_success = await VideoPreprocessor.preprocess(video);
  if (!preproces_success) {
    res.status(500).send({ message: "failed to preprocess video" });
    return;
  }
  res.status(200).send(video);
  return video;
};

export default Details;
