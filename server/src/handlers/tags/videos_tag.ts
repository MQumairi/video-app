import { Request, Response } from "express";
import { Tag } from "../../models/tag";
import { VideoMeta } from "../../models/video_meta";
import VideoTagger from "../../lib/video_tagger";

const TagVideos = async (req: Request, res: Response): Promise<void> => {
  console.log("entered tag videos");
  const videos: VideoMeta[] = req.body.videos;
  console.log(`request videos: ${videos.length}`);
  const tags: Tag[] = req.body.tags;
  console.log(`request tags ${tags.length}`);
  try {
    console.log("applying tags");
    const video_tagger = new VideoTagger(videos, tags);
    await video_tagger.apply_tags_to_videos();
    res.status(200).json({ message: "done" });
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({ error: "error tagging video" });
  }
};

export default TagVideos;
