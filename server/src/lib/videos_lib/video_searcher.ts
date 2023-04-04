import { SelectQueryBuilder, getRepository } from "typeorm";
import { SearchQuery } from "../search_query";
import { VideoMeta } from "../../models/video_meta";
import { Tag } from "../../models/tag";
import { ImagePreprocessor } from "../images_lib/image_preprocessor";

export class VideoSearcher {
  query: SearchQuery;
  page_capacity = 12;

  constructor(query: SearchQuery) {
    console.log("creating VideoSearcher");
    this.query = query;
  }

  video_search_results = async (): Promise<[VideoMeta[], number]> => {
    try {
      const skips = (this.query.page - 1) * this.page_capacity;
      const video_query = this.build_video_query().skip(skips).take(this.page_capacity);
      const [videos, count] = await video_query.getManyAndCount();
      await ImagePreprocessor.process_video_thumbs(videos);
      return [videos, count];
    } catch (err) {
      console.log("rescued err:", err);
      return [[], 0];
    }
  };

  random_video_advanced_search_result = async (): Promise<VideoMeta | undefined> => {
    try {
      return await this.build_video_query().orderBy("RANDOM()").getOne();
    } catch (err) {
      console.log("rescued err:", err);
    }
  };

  private build_video_query = (): SelectQueryBuilder<VideoMeta> => {
    const video_meta_repo = getRepository(VideoMeta);
    let query = video_meta_repo
      .createQueryBuilder("video")
      .addGroupBy("video.id")
      .leftJoinAndSelect("video.gallery", "gallery")
      .leftJoinAndSelect("video.thumbnail", "thumbnail")
      .leftJoinAndSelect("thumbnail.file_scripts", "file_script")
      .addGroupBy("gallery.id")
      .addGroupBy("thumbnail.id")
      .addGroupBy("file_script.id");
    query = this.query_video_tags(query);
    query = this.query_min_rating(query, this.query.min_rating);
    query = this.query_max_rating(query, this.query.max_rating);
    query = this.query_min_resolution(query, this.query.min_resolution);
    return query.addOrderBy("video.path", "ASC");
  };

  private query_video_tags = (query: SelectQueryBuilder<VideoMeta>): SelectQueryBuilder<VideoMeta> => {
    query.innerJoin("video.tags", "tag");
    query.where(`video.id IN (${this.get_inner_query(this.query.included_tags, true).getSql()})`);
    query.andWhere(`video.id NOT IN (${this.get_inner_query(this.query.excluded_tags, false).getSql()})`);
    return query;
  };

  private query_min_rating = (query: SelectQueryBuilder<VideoMeta>, min_rating: number): SelectQueryBuilder<VideoMeta> => {
    if (min_rating == 0) return query;
    query.andWhere("video.rating >= :min_rating", { min_rating: min_rating });
    return query;
  };

  private query_max_rating = (query: SelectQueryBuilder<VideoMeta>, max_rating: number): SelectQueryBuilder<VideoMeta> => {
    if (max_rating == 10) return query;
    query.andWhere("video.rating <= :max_rating", { max_rating: max_rating });
    return query;
  };

  private query_min_resolution = (query: SelectQueryBuilder<VideoMeta>, min_resolution: number): SelectQueryBuilder<VideoMeta> => {
    if (min_resolution == 0) return query;
    query.andWhere("video.height >= :min_resolution", { min_resolution: min_resolution });
    return query;
  };

  private get_inner_query = (tags: Tag[], include_having: boolean): SelectQueryBuilder<VideoMeta> => {
    const video_meta_repo = getRepository(VideoMeta);
    const tag_ids = Tag.get_ids(tags);
    let query = video_meta_repo
      .createQueryBuilder("video")
      .select("video.id", "id")
      .innerJoin("video.tags", "tag")
      .where(`tag.id IN (${tag_ids.join(",")})`);
    if (!include_having) return query;
    return query.addGroupBy("video.id").having(`COUNT(DISTINCT tag.id)=${tag_ids.length}`);
  };
}
