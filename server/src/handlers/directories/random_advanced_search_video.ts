import { Request, Response } from "express";
import { VideoMeta } from "../../models/video_meta";
import get_random_int from "../../util/shuffle_method";
import { advanced_search_results } from "./advanced_search";

const RandomAdvancedSearchVideo = async (req: Request, res: Response): Promise<VideoMeta | undefined> => {
  console.log("entered random advanced search");
  const videos = advanced_search_results;
  console.log("videos:", advanced_search_results);
  const random_index = get_random_int(videos.length);
  const random_video = videos[random_index];
  res.status(200).send(random_video);
  return random_video;
};

export default RandomAdvancedSearchVideo;
