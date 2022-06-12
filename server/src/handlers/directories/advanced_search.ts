import { Request, Response } from "express";
import { Directory } from "../../models/directory";
import { VideoMeta } from "../../models/video_meta";
import { getRepository, SelectQueryBuilder } from "typeorm";
import { Tag } from "../../models/tag";

export let advanced_search_results: VideoMeta[] = [];

const AdvancedSearch = async (req: Request, res: Response): Promise<Directory | undefined> => {
  // Object includes included_tags, min_rating
  const included_tags: Tag[] = req.body.included_tags ?? [];
  const min_rating: number = req.body.min_rating ?? 0;
  // Build query
  const video_meta_repo = getRepository(VideoMeta);
  let query = video_meta_repo.createQueryBuilder("video").innerJoin("video.tags", "tag");
  query = query_tags(query, included_tags);
  query = query_rating(query, min_rating);
  const videos = await query.getMany();
  advanced_search_results = videos;
  res.json(videos);
  return undefined;
};

const query_tags = (query: SelectQueryBuilder<VideoMeta>, included_tags: Tag[]): SelectQueryBuilder<VideoMeta> => {
  if (included_tags.length == 0) return query;
  const tag_names: string[] = [];
  for (const tag_to_include of included_tags) {
    let tag_name = tag_to_include.name.replace(/\r?\n|\r/g, "");
    tag_names.push(tag_name);
  }
  query.where("tag.name IN (:...tags_to_include)", { tags_to_include: tag_names });
  query.groupBy("video.id, video.name");
  query.having("COUNT(DISTINCT tag.id) = :ntags", { ntags: tag_names.length });
  return query;
};

const query_rating = (query: SelectQueryBuilder<VideoMeta>, rating: number): SelectQueryBuilder<VideoMeta> => {
  if (rating == 0) return query;
  query.andWhere("video.rating >= :rating", { rating: rating });
  return query;
};

export default AdvancedSearch;
