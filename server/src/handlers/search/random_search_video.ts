import { Request, Response } from "express";
import { VideoMeta } from "../../models/video_meta";
import { MediaSearcher } from "../../lib/media_searcher";
import { SearchQuery } from "../../lib/search_query";

const RandomSearchVideo = async (req: Request, res: Response): Promise<VideoMeta | undefined> => {
  console.log("entered RandomSearchVideo");
  const search_query = await SearchQuery.from_request(req);
  const media_searcher = new MediaSearcher(search_query);
  const random_video = await media_searcher.random_video_advanced_search_result();
  if (!random_video) {
    res.status(404).send({ message: "No results found" });
    return;
  }
  res.status(200).send(random_video);
  return random_video;
};

export default RandomSearchVideo;
