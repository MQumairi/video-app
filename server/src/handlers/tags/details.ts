import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Tag } from "../../models/tag";

const Details = async (req: Request, res: Response): Promise<Tag | undefined> => {
  const id = +req.params.id;
  const tag_repo = getRepository(Tag);
  const tag_query = tag_repo.createQueryBuilder("tag").innerJoinAndSelect("tag.videos", "video_meta").where({ id: id });
  const tag = await tag_query.getOne();
  if (tag === undefined) {
    res.status(404).send("Tag not found");
    return undefined;
  }
  res.status(200).send(tag);
  return tag;
};

export default Details;
