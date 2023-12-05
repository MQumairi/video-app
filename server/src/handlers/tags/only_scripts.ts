import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Tag } from "../../models/tag";

const Scripts = async (req: Request, res: Response): Promise<Tag[]> => {
  const tag_repo = getRepository(Tag);
  const scripts = await tag_repo.find({ where: { is_script: true }, order: { name: "ASC" } });
  res.json(scripts);
  return scripts;
};

export default Scripts;
