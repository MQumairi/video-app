import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Tag } from "../../models/tag";

const Uncategorized = async (req: Request, res: Response): Promise<Tag[]> => {
  const tag_repo = getRepository(Tag);
  const tags = await tag_repo.find({
    where: { is_studio: false, is_character: false, is_playlist: false, is_script: false, is_series: false },
    order: { name: "ASC" },
  });
  res.json(tags);
  return tags;
};

export default Uncategorized;
