import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Tag } from "../../models/tag";

const List = async (req: Request, res: Response): Promise<Tag[]> => {
  const tag_repo = getRepository(Tag);
  const tag_list = await tag_repo.find({ order: { name: "ASC" } });
  res.json(tag_list);
  return tag_list;
};

export default List;
