import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { VideoScript } from "../../models/video_script";

const Details = async (req: Request, res: Response): Promise<VideoScript | undefined> => {
  const id = +req.params.id;
  const script = await getRepository(VideoScript).findOne(id, { relations: ["videos"] });
  if (!script) {
    res.status(404).send("VideoScript not found");
    return;
  }
  res.status(200).send(script);
  return script;
};

export default Details;
