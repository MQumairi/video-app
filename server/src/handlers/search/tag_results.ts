import { Request, Response } from "express";
import { VideoMeta } from "../../models/video_meta";
import { SearchQuery } from "../../lib/search_query";
import { VideoSearcher } from "../../lib/videos_lib/video_searcher";
import { Tag } from "../../models/tag";
import VideoTagger from "../../lib/videos_lib/video_tagger";

const TagResults = async (req: Request, res: Response): Promise<VideoMeta[]> => {
  console.log("entered TagResults");
  // Find videos
  const search_query = await SearchQuery.from_request(req);
  const media_searcher = new VideoSearcher(search_query);
  const videos = await media_searcher.video_objects();
  // Tag videos
  const tags: Tag[] = req.body.tags;
  try {
    console.log("applying tags");
    const video_tagger = new VideoTagger(videos, tags);
    await video_tagger.apply_tags_to_videos();
    res.status(200).json({ message: "done" });
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({ error: "error tagging video" });
  }
  return videos;
};

export default TagResults;
