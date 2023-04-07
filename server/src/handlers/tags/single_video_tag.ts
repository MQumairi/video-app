import { Request, Response } from "express";
import { Tag } from "../../models/tag";
import { VideoMeta } from "../../models/video_meta";
import Tagger from "../../lib/tagger";
import { getRepository } from "typeorm";

const TagSingleVideo = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("entered tag single video");
    const video: VideoMeta = req.body.video;
    console.log(`request video: ${video.id}`);
    const tags: Tag[] = req.body.tags;
    console.log(`request tags ${tags.length}`);
    console.log("applying tags");
    const video_repo = getRepository(VideoMeta);
    const found_video = await video_repo.findOne(video.id);
    if (!found_video) {
      res.status(200).json({ message: "video not found" });
      return;
    }
    const new_tags = await Tagger.expand_tags_with_children(tags);
    found_video.tags = new_tags;
    const saved_video = await video_repo.save(found_video);
    res.status(200).json(saved_video);
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({ error: "error tagging video" });
  }
};

export default TagSingleVideo;
