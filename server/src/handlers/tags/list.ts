import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Tag } from "../../models/tag";

const List = async (req: Request, res: Response): Promise<Tag[]> => {
  try {
    const tag_repo = getRepository(Tag);
    const tag_list = await tag_repo.find({ order: { name: "ASC" } });
    res.json(tag_list);
    return tag_list;
  } catch (error) {
    console.log("error:", error);
    return [];
  }
};

export default List;
