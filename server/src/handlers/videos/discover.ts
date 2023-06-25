import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { VideoMeta } from "../../models/video_meta";
import { ImagePreprocessor } from "../../lib/images_lib/image_preprocessor";
import { Tag } from "../../models/tag";
import { MAX_RATING, MIN_RATING, MIN_RESOLUTION, SearchQuery } from "../../lib/search_query";
import { VideoSearcher } from "../../lib/videos_lib/video_searcher";

const Discover = async (req: Request, res: Response): Promise<VideoMeta[]> => {
  const hidden_tags = await getRepository(Tag).find({ where: { default_hidden: true } });
  const query = new SearchQuery("", [], hidden_tags, MIN_RATING, MAX_RATING, MIN_RESOLUTION, 1, 12, "path", "DESC");
  const video_searcher = new VideoSearcher(query);
  const [random_videos, _] = await video_searcher.random_videos();
  res.status(200).send(random_videos);
  return random_videos;
};

export default Discover;
