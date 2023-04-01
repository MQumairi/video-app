import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { FileScript } from "../../models/file_script";
import { VideoMeta } from "../../models/video_meta";

const Scripts = async (req: Request, res: Response): Promise<FileScript[]> => {
  const id = +req.params.id;
  const video = await getRepository(VideoMeta).findOne(id, { relations: ["file_scripts"] });
  if (!video) {
    res.status(404).send("video not found");
    return [];
  }
  res.status(200).send(video.file_scripts);
  return video.file_scripts;
};

export default Scripts;
