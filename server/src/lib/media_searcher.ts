import { SearchQuery } from "./search_query";
import { Tag } from "../models/tag";
import { VideoMeta } from "../models/video_meta";
import { getRepository, SelectQueryBuilder } from "typeorm";
import { ImageGallery } from "../models/image_gallery";
import { ImageMeta } from "../models/image_meta";
import { GalleryPreProcessor } from "./images_lib/gallery_preprocessor";

export const PAGE_CAPACITY = 12;

export class MediaSearcher {
  query: SearchQuery;

  constructor(query: SearchQuery) {
    this.query = query;
  }

  video_search_results = async (): Promise<[VideoMeta[], number]> => {
    try {
      const skips = (this.query.page - 1) * PAGE_CAPACITY;
      const [videos, count] = await this.build_video_query().skip(skips).take(PAGE_CAPACITY).getManyAndCount();
      await this.process_thumbnails(
        videos.map((v) => {
          return v.thumbnail;
        })
      );
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

  gallery_search_results = async (): Promise<[ImageGallery[], number]> => {
    try {
      const skips = (this.query.page - 1) * PAGE_CAPACITY;
      const [galleries, count] = await this.build_gallery_query().skip(skips).take(PAGE_CAPACITY).getManyAndCount();
      await this.process_thumbnails(
        galleries.map((g) => {
          return g.thumbnail;
        })
      );
      return [galleries, count];
    } catch (err) {
      console.log("rescued err:", err);
      return [[], 0];
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
    query = this.query_tags(query, this.query.included_tags);
    query = this.query_min_rating(query, this.query.min_rating);
    query = this.query_max_rating(query, this.query.max_rating);
    query = this.query_min_resolution(query, this.query.min_resolution);
    return query.addOrderBy("video.path", "ASC");
  };

  private query_tags = (query: SelectQueryBuilder<VideoMeta>, included_tags: Tag[]): SelectQueryBuilder<VideoMeta> => {
    if (included_tags.length == 0) return query;
    const tag_names: string[] = [];
    for (const tag_to_include of included_tags) {
      let tag_name = tag_to_include.name.replace(/\r?\n|\r/g, "");
      tag_names.push(tag_name);
    }
    query.innerJoin("video.tags", "tag");
    query.where("tag.name IN (:...tags_to_include)", { tags_to_include: tag_names });
    query.addGroupBy("video.id, video.name");
    query.having("COUNT(DISTINCT tag.id) = :ntags", { ntags: tag_names.length });
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

  private build_gallery_query = (): SelectQueryBuilder<ImageGallery> => {
    const gallery_repo = getRepository(ImageGallery);
    let query = gallery_repo
      .createQueryBuilder("gallery")
      .innerJoin("gallery.tags", "tag")
      .leftJoinAndSelect("gallery.images", "image")
      .leftJoinAndSelect("gallery.thumbnail", "thumbnail")
      .leftJoinAndSelect("thumbnail.file_scripts", "file_script")
      .addGroupBy("gallery.id")
      .addGroupBy("image.id")
      .addGroupBy("thumbnail.id")
      .addGroupBy("file_script.id");
    return this.query_image_tags(query, this.query.included_tags).addOrderBy("gallery.name", "ASC");
  };

  private query_image_tags = (query: SelectQueryBuilder<ImageGallery>, included_tags: Tag[]): SelectQueryBuilder<ImageGallery> => {
    if (included_tags.length == 0) return query;
    const tag_names: string[] = [];
    for (const tag_to_include of included_tags) {
      let tag_name = tag_to_include.name.replace(/\r?\n|\r/g, "");
      tag_names.push(tag_name);
    }
    query.where("tag.name IN (:...tags_to_include)", { tags_to_include: tag_names });
    query.addGroupBy("gallery.id, gallery.name");
    query.having("COUNT(DISTINCT tag.id) = :ntags", { ntags: tag_names.length });
    return query;
  };

  private async process_thumbnails(thumbnails: ImageMeta[]) {
    for (let thumb of thumbnails) {
      if (thumb === null) continue;
      if (thumb.file_scripts) await GalleryPreProcessor.process_image(thumb);
    }
  }
}
