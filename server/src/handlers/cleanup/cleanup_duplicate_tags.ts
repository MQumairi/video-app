import { getRepository } from "typeorm";
import { Tag } from "../../models/tag";
import { Request, Response } from "express";

const CleanupDuplicateTags = async (req: Request, res: Response): Promise<void> => {
  const tags_repo = getRepository(Tag);
  const tags = await tags_repo.find();
  const seen = new Set<string>();
  const duplicates: Tag[] = [];
  for (let t of tags) {
    if (seen.has(t.name)) {
      duplicates.push(t);
    } else {
      seen.add(t.name);
    }
  }
  await tags_repo.remove(duplicates);
  res.json(duplicates);
};

export default CleanupDuplicateTags;
