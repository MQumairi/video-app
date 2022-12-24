import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Tag } from "../../models/tag";

const Details = async (req: Request, res: Response): Promise<Tag | undefined> => {
  console.log("entered tag details");
  const id = +req.params.id;
  const tag_repo = getRepository(Tag);
  const tag = await tag_repo.findOne(id, { relations: ["videos", "child_tags"] });
  if (!tag) {
    res.status(404).send("Tag not found");
    return undefined;
  }
  tag.videos.sort((v1, v2) => {
    return v1.name.localeCompare(v2.name);
  });
  console.log("tag videos size:", tag.videos.length);
  res.status(200).send(tag);
  return tag;
};

export default Details;
