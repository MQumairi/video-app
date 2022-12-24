import { Tag } from "./tag";
import { VideoMeta } from "./video_meta";
import { getRepository, SelectQueryBuilder } from "typeorm";

export class AdvancedSearcher {
  included_tags: Tag[];
  min_rating: number = 0;
  max_rating: number = 0;

  constructor(included_tags: Tag[], min_rating: number = 0, max_rating: number = 0) {
    this.included_tags = included_tags;
    this.min_rating = min_rating;
    this.max_rating = max_rating;
  }

  build_query = (): SelectQueryBuilder<VideoMeta> => {
    const video_meta_repo = getRepository(VideoMeta);
    let query = video_meta_repo.createQueryBuilder("video").innerJoin("video.tags", "tag");
    query = this.query_tags(query, this.included_tags);
    query = this.query_min_rating(query, this.min_rating);
    query = this.query_max_rating(query, this.max_rating);
    return query;
  };

  advanced_search_results = async (): Promise<VideoMeta[]> => {
    return await this.build_query().getMany();
  };

  random_advanced_search_result = async (): Promise<VideoMeta | undefined> => {
    return await this.build_query().orderBy("RANDOM()").getOne();
  };

  query_tags = (query: SelectQueryBuilder<VideoMeta>, included_tags: Tag[]): SelectQueryBuilder<VideoMeta> => {
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

  query_min_rating = (query: SelectQueryBuilder<VideoMeta>, min_rating: number): SelectQueryBuilder<VideoMeta> => {
    if (min_rating == 0) return query;
    query.andWhere("video.rating >= :min_rating", { min_rating: min_rating });
    return query;
  };

  query_max_rating = (query: SelectQueryBuilder<VideoMeta>, max_rating: number): SelectQueryBuilder<VideoMeta> => {
    if (max_rating == 5) return query;
    query.andWhere("video.rating <= :max_rating", { max_rating: max_rating });
    return query;
  };
}
