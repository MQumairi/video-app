import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Tag } from "../../models/tag";

const Details = async (req: Request, res: Response): Promise<Tag | undefined> => {
  const id = +req.params.id;
  const tag_repo = getRepository(Tag);
  const tag = await tag_repo.findOne({ relations: ["videos"], where: { id: id } });
  if (tag === undefined) {
    res.status(404).send("Tag not found");
    return undefined;
  }
  res.status(200).send(tag);
  return tag;
};

export default Details;
