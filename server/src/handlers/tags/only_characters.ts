import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Tag } from "../../models/tag";

const Characters = async (req: Request, res: Response): Promise<Tag[]> => {
  const tag_repo = getRepository(Tag);
  const characters = await tag_repo.find({ where: { is_character: true }, order: { name: "ASC" } });
  res.json(characters);
  return characters;
};

export default Characters;
