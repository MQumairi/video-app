import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Video } from "../../models/video";

const Scan = async (req: Request, res: Response): Promise<Video[]> => {
  const videoRepo = getRepository(Video);
  const videoList = await videoRepo.find();
  res.json(videoList);
  return videoList;
};

export default Scan;
