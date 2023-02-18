import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { FileScript } from "../../models/file_script";

const MediaCount = async (req: Request, res: Response) => {
  const id = +req.params.id;
  const script = await getRepository(FileScript).findOne(id, { relations: ["videos", "images"] });
  if (!script) {
    res.status(404).send("FileScript not found");
    return [];
  }
  res.status(200).send({ videos: script.videos.length, images: script.images.length });
  return;
};

export default MediaCount;
