import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Tag } from "../../models/tag";
import Tagger from "../../lib/tagger";
import VideoTagger from "../../lib/videos_lib/video_tagger";

const AddChildTags = async (req: Request, res: Response): Promise<void> => {
  console.log("entered AddChildTags");
  try {
    const tag: Tag = req.body.tag;
    const new_child_tags: Tag[] = req.body.child_tags;
    console.log("new_child_tags:", new_child_tags);
    const tag_repo = getRepository(Tag);
    // Find tags
    const found_tag = await tag_repo.findOne({ where: { name: tag.name }, relations: ["child_tags", "videos"] });
    if (!found_tag) {
      res.status(404).send({ message: "tag not found" });
      return;
    }
    console.log("before set length:", found_tag.child_tags.length);
    const new_tags = await Tagger.combine(found_tag.child_tags, new_child_tags);
    found_tag.child_tags = new_tags;
    console.log("after set length:", found_tag.child_tags.length);
    // Tag all found_tag.videos with new_tags
    const tagger = new VideoTagger(found_tag.videos, new_tags);
    await tagger.apply_tags_to_videos();
    await tag_repo.save(found_tag);
  } catch (err) {
    console.log("error:", err);
    res.status(409).send("Failed to add child tags");
    return;
  }
};

export default AddChildTags;
