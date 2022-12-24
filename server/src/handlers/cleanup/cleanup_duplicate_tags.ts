import { getRepository } from "typeorm";
import { Tag } from "../../models/tag";
import { Request, Response } from "express";

const CleanupDuplicateTags = async (req: Request, res: Response): Promise<void> => {
  console.log("cleaning database from duplicate tags");
  const tags_repo = getRepository(Tag);
  const tags = await tags_repo.find();
  const seen = new Set<string>();
  const duplicates: Tag[] = [];
  for (let t of tags) {
    console.log(`checking tag ${t.id}`);
    if (seen.has(t.name)) {
      console.log(`tag ${t.id} is a duplicate`);
      duplicates.push(t);
    } else {
      seen.add(t.name);
    }
  }
  await tags_repo.remove(duplicates);
  console.log("done cleanup duplicate tags");
  res.json(duplicates);
};

export default CleanupDuplicateTags;
