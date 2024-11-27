import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Tag } from "../../models/tag";

const DefaultExcluded = async (req: Request, res: Response): Promise<Tag[]> => {
  const tag_repo = getRepository(Tag);
  const tags = await tag_repo.find({
    where: { default_excluded: true },
    order: { name: "ASC" },
  });
  res.json(tags);
  return tags;
};

export default DefaultExcluded;