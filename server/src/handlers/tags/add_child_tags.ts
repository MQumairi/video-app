import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Tag } from "../../models/tag";

const AddChildTags = async (req: Request, res: Response): Promise<void> => {
  try {
    const tag: Tag = req.body.tag;
    const child_tags: Tag[] = req.body.child_tags;
    const tag_repo = getRepository(Tag);
    // Find tags
    const found_tag = await tag_repo.findOne({ where: { name: tag.name }, relations: ["child_tags"] });
    // Edit child tags
    const children_to_add: Tag[] = [];
    for (let c of child_tags) {
      const found_child = await tag_repo.findOne({ where: { name: c.name } });
      if (found_child) children_to_add.push(found_child);
    }
    console.log("found tag");
    if (!found_tag) {
      res.status(409).send("Failed to add child tags");
      return;
    }
    if (found_tag.child_tags == null) {
      console.log("children were null");
      found_tag.child_tags = [];
    }
    console.log("before set length:", found_tag.child_tags.length);
    const new_tags = found_tag.child_tags.concat(children_to_add);
    found_tag.child_tags = new_tags;
    console.log("after set length:", found_tag.child_tags.length);
    await tag_repo.save(found_tag);
  } catch (err) {
    console.log("error:", err);
    res.status(409).send("Failed to add child tags");
    return;
  }
};

export default AddChildTags;
