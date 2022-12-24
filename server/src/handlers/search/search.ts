import { Request, Response } from "express";
import { MediaSearcher } from "../../models/media_searcher";
import { VideoMeta } from "../../models/video_meta";
import { cached_query } from "./cached_search_query";

const Search = async (req: Request, res: Response): Promise<VideoMeta[]> => {
  const media_searcher = new MediaSearcher(cached_query);
  const videos = await media_searcher.advanced_search_results();
  console.log("videos found:", videos.length);
  res.json(videos);
  return videos;
};

export default Search;
