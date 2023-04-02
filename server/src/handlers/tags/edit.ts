import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Tag } from "../../models/tag";

const Edit = async (req: Request, res: Response): Promise<Tag | undefined> => {
  console.log("eneted tag edit");
  const id = +req.params.id;
  const tag_repo = getRepository(Tag);
  const found_tag = await tag_repo.findOne(id);
  if (found_tag === undefined) {
    res.status(404).send("Tag not found");
    return undefined;
  }
  const submitted_tag: Tag = req.body;
  // Set the tag name
  found_tag.name = submitted_tag.name;
  // Set the tag type
  if (submitted_tag.is_playlist) {
    found_tag.is_playlist = true;
    found_tag.is_character = false;
    found_tag.is_studio = false;
  } else if (submitted_tag.is_character) {
    found_tag.is_playlist = false;
    found_tag.is_character = true;
    found_tag.is_studio = false;
  } else if (submitted_tag.is_studio) {
    found_tag.is_playlist = false;
    found_tag.is_character = false;
    found_tag.is_studio = true;
  } else {
    found_tag.is_playlist = false;
    found_tag.is_character = false;
    found_tag.is_studio = false;
  }
  // Set tag children
  found_tag.child_tags = submitted_tag.child_tags;
  const saved_tag = await tag_repo.save(found_tag);
  console.log("finished saving...");
  res.status(200).send(saved_tag);
  return saved_tag;
};

export default Edit;
