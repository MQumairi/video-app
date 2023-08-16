import { Request, Response } from "express";
import { VideoMeta } from "../../models/video_meta";
import { SearchQuery } from "../../lib/search_query";
import { VideoSearcher } from "../../lib/videos_lib/video_searcher";
import VideoTagger from "../../lib/videos_lib/video_tagger";

const TagResults = async (req: Request, res: Response): Promise<VideoMeta[]> => {
  console.log("entered TagResults");
  // Find videos
  const search_query = await SearchQuery.from_request(req, false);
  const media_searcher = new VideoSearcher(search_query);
  const videos = await media_searcher.video_objects();
  // Tag videos
  try {
    console.log("applying tags:", search_query.included_tags);
    const video_tag_adder = new VideoTagger(videos, search_query.included_tags);
    await video_tag_adder.apply_tags_to_videos();
    console.log("removing tags:", search_query.excluded_tags);
    const video_tag_remover = new VideoTagger(videos, search_query.excluded_tags);
    await video_tag_remover.remove_tags_from_videos();
    res.status(200).json({ message: "done" });
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({ error: "error tagging video" });
  }
  return videos;
};

export default TagResults;
