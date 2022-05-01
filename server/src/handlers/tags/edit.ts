import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Tag } from "../../models/tag";

const Edit = async (req: Request, res: Response): Promise<Tag | undefined> => {
  const id = +req.params.id;
  const tag_repo = getRepository(Tag);
  let found_tag = await tag_repo.findOne(id);
  if (found_tag === undefined) {
    res.status(404).send("Tag not found");
    return undefined;
  }
  found_tag.name = req.body.name;
  await tag_repo.save(found_tag);
  res.status(201).send(found_tag);
  return found_tag;
};

export default Edit;
