import { SelectQueryBuilder, getRepository } from "typeorm";
import { SearchQuery, ThumbStatus } from "../search_query";
import { VideoMeta } from "../../models/video_meta";
import { Tag } from "../../models/tag";
import { ImagePreprocessor } from "../images_lib/image_preprocessor";

export class VideoSearcher {
  search_query: SearchQuery;

  constructor(query: SearchQuery) {
    this.search_query = query;
  }

  video_search_results = async (): Promise<[VideoMeta[], number]> => {
    try {
      const skips = (this.search_query.page - 1) * this.search_query.page_capacity;
      const video_query = this.build_video_query().skip(skips).take(this.search_query.page_capacity);
      const [videos, count] = await video_query.getManyAndCount();
      await ImagePreprocessor.process_video_thumbs(videos);
      return [videos, count];
    } catch (err) {
      console.log("rescued err:", err);
      return [[], 0];
    }
  };

  video_objects = async (): Promise<VideoMeta[]> => {
    try {
      const video_query = this.build_video_query();
      return await video_query.getMany();
    } catch (err) {
      console.log("rescued err:", err);
      return [];
    }
  };

  random_single_video = async (): Promise<VideoMeta | undefined> => {
    try {
      return await this.build_video_query().orderBy("RANDOM()").getOne();
    } catch (err) {
      console.log("rescued err:", err);
    }
  };

  random_videos = async (): Promise<[VideoMeta[], number]> => {
    try {
      const skips = (this.search_query.page - 1) * this.search_query.page_capacity;
      const video_query = this.build_video_query().orderBy("RANDOM()").offset(skips).limit(this.search_query.page_capacity);
      const [videos, count] = await video_query.getManyAndCount();
      await ImagePreprocessor.process_video_thumbs(videos);
      return [videos, count];
    } catch (err) {
      console.log("rescued err:", err);
      return [[], 0];
    }
  };

  build_video_query = (): SelectQueryBuilder<VideoMeta> => {
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
    query = this.query_searched_text(query);
    query = this.query_min_rating(query, this.search_query.min_rating);
    query = this.query_max_rating(query, this.search_query.max_rating);
    query = this.query_min_resolution(query, this.search_query.min_resolution);
    if (this.search_query.thumb_status !== ThumbStatus.default) this.filter_thumb_status(query, this.search_query.thumb_status);
    query.addOrderBy(`video.${this.search_query.order_by}`, this.search_query.order_strategy);
    if (this.search_query.order_by != "path") query.addOrderBy(`video.path`);
    return query;
  };

  private query_searched_text = (query: SelectQueryBuilder<VideoMeta>): SelectQueryBuilder<VideoMeta> => {
    const searched_text = this.search_query.searched_text;
    if (searched_text.length === 0) return query;
    query.andWhere(`video.path LIKE '%${searched_text}%'`);
    return query;
  };

  private query_video_tags = (query: SelectQueryBuilder<VideoMeta>): SelectQueryBuilder<VideoMeta> => {
    query.innerJoin("video.tags", "tag");
    if (this.search_query.included_tags.length > 0) query.where(`video.id IN (${this.get_inner_query(this.search_query.included_tags, true).getSql()})`);
    if (this.search_query.excluded_tags.length > 0)
      query.andWhere(`video.id NOT IN (${this.get_inner_query(this.search_query.excluded_tags, false).getSql()})`);
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

  private filter_thumb_status = (query: SelectQueryBuilder<VideoMeta>, thumb_status: ThumbStatus): SelectQueryBuilder<VideoMeta> => {
    if (thumb_status === ThumbStatus.withThumb) return query.andWhere("video.thumbnail IS NOT NULL");
    else if (thumb_status === ThumbStatus.noThumb) return query.andWhere("video.thumbnail IS NULL");
    return query;
  };
}
