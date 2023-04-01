import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Tag } from "../../models/tag";

const Delete = async (req: Request, res: Response): Promise<void> => {
  const id = +req.params.id;
  const tag_repo = getRepository(Tag);
  const tag = await tag_repo.findOne(id);
  if (tag === undefined) {
    res.status(404).send({ message: `tag of id ${id} not found` });
    return;
  }
  await tag_repo.remove(tag!);
  res.status(200).send({ message: `deleted tag of id ${id}` });
};

export default Delete;
