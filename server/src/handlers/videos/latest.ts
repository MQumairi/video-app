import { Request, Response } from "express";
import { IsNull, Not, Repository, getRepository } from "typeorm";
import { VideoMeta } from "../../models/video_meta";
import { ImagePreprocessor } from "../../lib/images_lib/image_preprocessor";
import { MAX_RATING, MIN_RATING, MIN_RESOLUTION, SearchQuery } from "../../lib/search_query";
import { Tag } from "../../models/tag";
import { VideoSearcher } from "../../lib/videos_lib/video_searcher";

const Latest = async (req: Request, res: Response): Promise<VideoMeta[]> => {
  const hidden_tags = await getRepository(Tag).find({ where: { default_hidden: true } });
  const query = new SearchQuery("", [], hidden_tags, MIN_RATING, MAX_RATING, MIN_RESOLUTION, 1, 6, "created_at", "DESC");
  const video_searcher = new VideoSearcher(query);
  const [latest_videos, _] = await video_searcher.video_search_results();
  await ImagePreprocessor.process_video_thumbs(latest_videos);
  res.status(200).send(latest_videos);
  return latest_videos;
};

export default Latest;
