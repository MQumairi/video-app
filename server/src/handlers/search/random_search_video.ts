import { Request, Response } from "express";
import { VideoMeta } from "../../models/video_meta";
import { MediaSearcher } from "../../lib/media_searcher";
import { cached_query } from "./cached_search_query";

const RandomSearchVideo = async (req: Request, res: Response): Promise<VideoMeta | undefined> => {
  const media_searcher = new MediaSearcher(cached_query);
  const random_video = await media_searcher.random_advanced_search_result();
  if (random_video) {
    res.status(200).send(random_video);
    return random_video;
  }
  res.status(404).send({ message: "No results found" });
  return undefined;
};

export default RandomSearchVideo;
