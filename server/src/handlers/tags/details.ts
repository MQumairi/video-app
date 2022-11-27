import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Tag } from "../../models/tag";


const Details = async (req: Request, res: Response): Promise<Tag | undefined> => {
  const id = +req.params.id;
  const tag_repo = getRepository(Tag);
  const tag = await tag_repo
    .createQueryBuilder("tag")
    .where("tag.id = :id", { id: id })
    .innerJoinAndSelect("tag.videos", "videos")
    .orderBy("videos.name", "ASC")
    .getOne();

  if (!tag) {
    res.status(404).send("Tag not found");
    return undefined;
  }
  res.status(200).send(tag);
  return tag;
};

export default Details;