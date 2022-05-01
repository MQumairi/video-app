import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Tag } from "../../models/tag";

const Delete = async (req: Request, res: Response): Promise<void> => {
  const id = +req.params.id;
  const tag_repo = getRepository(Tag);
  const tag = await tag_repo.findOne(id);
  if (tag === undefined) {
    res.status(404).send("Not found");
    return;
  }
  await tag_repo.remove(tag!);
  res.status(201);
};

export default Delete;
