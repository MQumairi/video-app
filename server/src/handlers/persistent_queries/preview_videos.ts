import { Request, Response } from "express";
import { PersistentQuery } from "../../models/persistent_query";
import { VideoMeta } from "../../models/video_meta";
import { VideoSearcher } from "../../lib/videos_lib/video_searcher";

const PreviewVideos = async (req: Request, res: Response): Promise<VideoMeta[]> => {
  const persistent_query: PersistentQuery = req.body.query;
  if (!persistent_query) {
    res.status(404).send("PersistentQuery not found");
    return [];
  }
  const search_query = PersistentQuery.build_search_query(persistent_query);
  const media_searcher = new VideoSearcher(search_query);
  const [videos, count] = await media_searcher.random_videos();
  console.log("count is:", count);
  console.log("videos returned:", videos.length);
  res.status(200).send({ videos: videos, count: count });
  return videos;
};

export default PreviewVideos;
