import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { VideoMeta } from "../../models/video_meta";

const Rate = async (req: Request, res: Response): Promise<VideoMeta | undefined> => {
  console.log("entered rate");
  const id = req.params.id;
  const videoMetaRepo = getRepository(VideoMeta);
  let video = await videoMetaRepo.findOne(+id);
  if (!video) {
    res.status(404).send({ message: "video not found" });
    return;
  }
  video.rating = req.body.rating ?? 0;
  res.status(200).send({ message: `"changed rating to ${video.rating}` });
  return await videoMetaRepo.save(video);
};

export default Rate;
