import { Request, Response } from "express";
import { Tag } from "../../models/tag";
import { VideoMeta } from "../../models/video_meta";
import VideoTagger from "../../lib/video_tagger";

const UntagVideos = async (req: Request, res: Response): Promise<void> => {
  console.log("entered untag videos");
  const videos: VideoMeta[] = req.body.videos;
  console.log(`request videos: ${videos.length}`);
  const tag: Tag = req.body.tag;
  console.log(`request tags ${tag.id}`);
  try {
    console.log("applying tags");
    const video_tagger = new VideoTagger(videos, [tag]);
    await video_tagger.remove_tags_from_videos();
    res.status(200).json({ message: "done" });
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({ error: "error tagging video" });
  }
};

export default UntagVideos;
