import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Tag } from "../../models/tag";
import { PersistentQuery } from "../../models/persistent_query";

const Create = async (req: Request, res: Response): Promise<Tag | undefined> => {
  try {
    let tag: Tag = req.body.tag;
    console.log("tag is:", tag);
    console.log("req body is:", req.body.tag);
    const tag_repo = getRepository(Tag);
    const found_tag = await tag_repo.findOne({ where: { name: tag.name } });
    if (found_tag) {
      console.log("Tag already exists.");
      res.status(201).send(found_tag);
      return found_tag;
    }
    const saved_tag = await tag_repo.save(tag);
    console.log(saved_tag);
    if (saved_tag.is_dynamic_playlist) {
      const queries: PersistentQuery[] = req.body.queries;
      await Tag.create_dynamic_playlist(tag, queries);
    }
    res.status(201).send(tag);
    return tag;
  } catch (error) {
    res.status(409).send("Failed to create Tag, error:\n" + error);
    return undefined;
  }
};

export default Create;
