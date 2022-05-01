import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Tag } from "../../models/tag";

const Details = async (req: Request, res: Response): Promise<Tag | undefined> => {
  const id = +req.params.id;
  const tag = await getRepository(Tag).findOne(id);
  if (tag === undefined) {
    res.status(404).send("Tag not found");
    return undefined;
  }
  res.status(200).send(tag);
  return tag;
};

export default Details;
