import { Request, Response } from "express";
import { VideoMeta } from "../../models/video_meta";
import { SearchQuery } from "../../lib/search_query";
import { VideoSearcher } from "../../lib/videos_lib/video_searcher";

const RandomSearchVideo = async (req: Request, res: Response): Promise<VideoMeta | undefined> => {
  console.log("entered RandomSearchVideo");
  const search_query = await SearchQuery.from_request(req);
  const media_searcher = new VideoSearcher(search_query);
  const random_video = await media_searcher.random_single_video();
  if (!random_video) {
    res.status(404).send({ message: "No results found" });
    return;
  }
  res.status(200).send(random_video);
  return random_video;
};

export default RandomSearchVideo;
