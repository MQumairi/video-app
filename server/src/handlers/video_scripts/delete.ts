import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { VideoScript } from "../../models/video_script";

const Delete = async (req: Request, res: Response): Promise<void> => {
  const id = +req.params.id;
  const script_repo = getRepository(VideoScript);
  const script = await script_repo.findOne(id);
  if (!script) {
    res.status(404).send("Not found");
    return;
  }
  await script_repo.remove(script);
  res.status(200).send(`Removed script of id ${script.id}`);
};

export default Delete;
