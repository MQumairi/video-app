import { Request, Response } from "express";
import { VideoMeta } from "../../models/video_meta";
import { SearchQuery } from "../../lib/search_query";
import { VideoSearcher } from "../../lib/videos_lib/video_searcher";
import VideoTagger from "../../lib/videos_lib/video_tagger";
import { Tag } from "../../models/tag";
import { VideoBatcher } from "../../lib/videos_lib/video_batcher";

// Given a video and array of tags, apply tags to video
const batcher_handler_add_tags = async (video: VideoMeta, args: any[] = []): Promise<boolean> => {
  const tags: Tag[] = args;
  const video_tag_adder = new VideoTagger([video], tags);
  await video_tag_adder.apply_tags_to_videos();
  return true;
};

// Given a video and array of tags, remove tags from video
const batcher_handler_rem_tags = async (video: VideoMeta, args: any[] = []): Promise<boolean> => {
  const tags: Tag[] = args;
  const video_tag_remover = new VideoTagger([video], tags);
  await video_tag_remover.remove_tags_from_videos();
  return true;
};

const TagResults = async (req: Request, res: Response): Promise<VideoMeta[]> => {
  console.log("entered TagResults");
  // Find videos
  const search_query = await SearchQuery.from_request(req, false);
  const tags_to_add: Tag[] = req.body.tags_to_add;
  const tags_to_remove: Tag[] = req.body.tags_to_remove;
  const searcher = new VideoSearcher(search_query);
  const video_query = searcher.build_video_query();
  // Tag videos
  try {
    if (tags_to_add.length) {
      console.log("applying tags using batcher:", search_query.included_tags);
      await VideoBatcher.execute_handler(video_query, batcher_handler_add_tags, tags_to_add);
    }

    if (tags_to_remove.length) {
      console.log("removing tags using batcher:", search_query.excluded_tags);
      await VideoBatcher.execute_handler(video_query, batcher_handler_rem_tags, tags_to_remove);
    }
    res.status(200).json({ message: "done" });
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({ error: "error tagging video" });
  }
  return [];
};

export default TagResults;
