import { Request, Response } from "express";
import { Tag } from "../../models/tag";
import { getRepository } from "typeorm";
import { VideoMeta } from "../../models/video_meta";

const Tags = async (req: Request, res: Response): Promise<Tag[]> => {
  const id = +req.params.id;
  const video = await getRepository(VideoMeta).findOne(id, { relations: ["tags"] });
  if (!video) {
    res.status(404).send("video not found");
    return [];
  }
  res.status(200).send(video.tags);
  return video.tags;
};

export default Tags;
