import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Video } from "../../models/video";

const Delete = async (req: Request, res: Response): Promise<void> => {
  const videoRepo = getRepository(Video);
  const video = await videoRepo.find();
  if (video === undefined) {
    res.status(404).send("Not found");
    return;
  }
  await videoRepo.remove(video);
  res.status(200).send("Removed " + "video");
};

export default Delete;
