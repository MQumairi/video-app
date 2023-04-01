import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Tag } from "../../models/tag";
import Tagger from "../../lib/tagger";

const RemoveChildTags = async (req: Request, res: Response): Promise<void> => {
  const tag: Tag = req.body.tag;
  const children_to_remove: Tag[] = req.body.child_tags;
  const tag_repo = getRepository(Tag);
  const found_tag = await tag_repo.findOne({ where: { name: tag.name }, relations: ["child_tags"] });
  if (!found_tag || found_tag.child_tags == null || found_tag.child_tags.length == 0) {
    res.status(409).send("Failed to remove child tags");
    return;
  }
  console.log(`before removal legnth: ${found_tag.child_tags.length}`);
  const new_tags = Tagger.remove(children_to_remove, found_tag.child_tags);
  found_tag.child_tags = new_tags;
  console.log(`after removal legnth: ${found_tag.child_tags.length}`);
  await tag_repo.save(found_tag);
  res.status(201).send(found_tag);
};

export default RemoveChildTags;
