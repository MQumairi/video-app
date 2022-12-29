import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { VideoScript } from "../../models/video_script";

const List = async (req: Request, res: Response): Promise<VideoScript[]> => {
  const script_repo = getRepository(VideoScript);
  const script_list = await script_repo.find();
  res.json(script_list);
  return script_list;
};

export default List;
