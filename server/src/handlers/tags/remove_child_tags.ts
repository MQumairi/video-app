import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Tag } from "../../models/tag";

const RemoveChildTags = async (req: Request, res: Response): Promise<void> => {
  const tag: Tag = req.body.tag;
  const children_to_remove: Tag[] = req.body.child_tags;
  const tag_repo = getRepository(Tag);
  const found_tag = await tag_repo.findOne({ where: { name: tag.name }, relations: ["child_tags"] });
  if (!found_tag || found_tag.child_tags == null || found_tag.child_tags.length == 0) {
    res.status(409).send("Failed to remove child tags");
    return;
  }
  for (let child_to_remove of children_to_remove) {
    let tag_children = found_tag.child_tags;
    tag_children = tag_children.filter(function (t) {
      return t.name !== child_to_remove?.name;
    });
    found_tag.child_tags = tag_children;
    await tag_repo.save(found_tag);
  }
  res.status(201).send(found_tag);
};

export default RemoveChildTags;
