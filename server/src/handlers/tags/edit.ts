import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Tag } from "../../models/tag";
import VideoTagger from "../../lib/videos_lib/video_tagger";

const Edit = async (req: Request, res: Response): Promise<Tag | undefined> => {
  console.log("eneted tag edit");
  const id = +req.params.id;
  const tag_repo = getRepository(Tag);
  const found_tag = await tag_repo.findOne(id, { relations: ["videos", "child_tags"] });
  if (found_tag === undefined) {
    res.status(404).send("Tag not found");
    return undefined;
  }
  const submitted_tag: Tag = req.body;
  console.log(submitted_tag);
  // Set the tag name
  found_tag.name = submitted_tag.name;
  // Set the tag type
  if (submitted_tag.is_playlist) {
    found_tag.make_playlist();
  } else if (submitted_tag.is_character) {
    found_tag.make_character();
  } else if (submitted_tag.is_series) {
    found_tag.make_series();
  } else if (submitted_tag.is_studio) {
    found_tag.make_studio();
  } else if (submitted_tag.is_script) {
    await found_tag.make_script(submitted_tag.start_script, submitted_tag.cleanup_script);
  } else {
    found_tag.make_default();
  }
  // If tag current children differ from submitted tag's children
  if (!Tag.tags_equal(found_tag.child_tags, submitted_tag.child_tags)) {
    console.log("tag children differ...");
    // Set tag children
    found_tag.child_tags = submitted_tag.child_tags;
    // Apply new child tags to all found_tag.videos
    const tagger = new VideoTagger(found_tag.videos, submitted_tag.child_tags);
    // Don't block with await
    tagger.apply_tags_to_videos();
  }
  found_tag.default_excluded = submitted_tag.default_excluded;
  found_tag.default_hidden = submitted_tag.default_hidden;
  const saved_tag = await tag_repo.save(found_tag);
  console.log("finished saving...");
  res.status(200).send(saved_tag);
  return saved_tag;
};

export default Edit;
