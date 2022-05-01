import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Tag } from "../../models/tag";

const Create = async (req: Request, res: Response): Promise<Tag | undefined> => {
  try {
    let tag: Tag = req.body;
    const tag_repo = getRepository(Tag);
    await tag_repo.save(tag);
    res.status(201).send(tag);
    return tag;
  } catch (error) {
    res.status(409).send("Failed to create Tag, error:\n" + error);
    return undefined;
  }
};

export default Create;
