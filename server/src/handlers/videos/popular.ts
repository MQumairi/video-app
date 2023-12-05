import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { VideoMeta } from "../../models/video_meta";
import { Tag } from "../../models/tag";
import { MAX_RATING, MIN_RESOLUTION, SearchQuery } from "../../lib/search_query";
import { VideoSearcher } from "../../lib/videos_lib/video_searcher";

const Popular = async (req: Request, res: Response): Promise<VideoMeta[]> => {
  const hidden_tags = await getRepository(Tag).find({ where: { default_hidden: true } });
  const query = new SearchQuery("", [], hidden_tags, MAX_RATING - 2, MAX_RATING, MIN_RESOLUTION, 1, 12, "path", "DESC");
  const video_searcher = new VideoSearcher(query);
  const [popular_videos, _] = await video_searcher.random_videos();
  res.status(200).send(popular_videos);
  return popular_videos;
};

export default Popular;
