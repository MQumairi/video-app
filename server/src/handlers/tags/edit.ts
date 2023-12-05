import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Tag } from "../../models/tag";
import VideoTagger from "../../lib/videos_lib/video_tagger";
import { PersistentQuery } from "../../models/persistent_query";

const Edit = async (req: Request, res: Response): Promise<Tag | undefined> => {
  console.log("eneted tag edit");
  const id = +req.params.id;
  const tag_repo = getRepository(Tag);
  const found_tag = await tag_repo.findOne(id, { relations: ["videos", "child_tags", "persistent_queries"] });
  if (found_tag === undefined) {
    res.status(404).send("Tag not found");
    return undefined;
  }
  const submitted_tag: Tag = req.body.tag;
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
    await found_tag.make_script(submitted_tag.activation_script, submitted_tag.deactivation_script);
  } else if (submitted_tag.is_dynamic_playlist) {
    console.log(`found tag now has ${found_tag.persistent_queries.length} queries`);
    const queries: PersistentQuery[] = req.body.queries;
    console.log(`receieved ${queries.length} queries`);
    found_tag.make_dynamic_playlist(queries);
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
  console.log(`found tag now has ${found_tag.persistent_queries.length} queries`);
  const saved_tag = await tag_repo.save(found_tag);
  console.log(`saved_tag now has ${saved_tag.persistent_queries.length} queries`);
  console.log("finished saving...");
  res.status(200).send(saved_tag);
  return saved_tag;
};

export default Edit;
