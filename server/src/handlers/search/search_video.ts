import { Request, Response } from "express";
import { MediaSearcher } from "../../lib/media_searcher";
import { VideoMeta } from "../../models/video_meta";
import { SearchQuery } from "../../lib/search_query";

const SearchVideo = async (req: Request, res: Response): Promise<VideoMeta[]> => {
  console.log("entered SearchVideo");
  const search_query = await SearchQuery.from_request(req);
  const media_searcher = new MediaSearcher(search_query);
  const [videos, count] = await media_searcher.video_search_results();
  console.log("count is:", count);
  console.log("videos returned:", videos.length);
  res.status(200).send({ videos: videos, count: count });
  return videos;
};

export default SearchVideo;
