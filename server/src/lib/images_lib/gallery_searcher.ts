import { SelectQueryBuilder, getRepository } from "typeorm";
import { ImageGallery } from "../../models/image_gallery";
import { SearchQuery } from "../search_query";
import { Tag } from "../../models/tag";
import { ImageMeta } from "../../models/image_meta";
import { ImagePreprocessor } from "./image_preprocessor";

export const PAGE_CAPACITY = 12;

export class GallerySearcher {
  query: SearchQuery;

  constructor(query: SearchQuery) {
    this.query = query;
  }

  gallery_search_results = async (): Promise<[ImageGallery[], number]> => {
    try {
      const skips = (this.query.page - 1) * PAGE_CAPACITY;
      const [galleries, count] = await this.build_gallery_query().skip(skips).take(PAGE_CAPACITY).getManyAndCount();
      await ImagePreprocessor.process_gallery_thumbs(galleries);
      return [galleries, count];
    } catch (err) {
      console.log("rescued err:", err);
      return [[], 0];
    }
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
    return this.query_image_tags(query).addOrderBy("gallery.name", "ASC");
  };

  private query_image_tags = (query: SelectQueryBuilder<ImageGallery>): SelectQueryBuilder<ImageGallery> => {
    const included_tag_ids = Tag.get_ids(this.query.included_tags);
    query.where("tag.id IN (:...included_tag_ids)", { included_tag_ids });
    query.addGroupBy("gallery.id, gallery.name");
    query.having("COUNT(DISTINCT tag.id) = :ntags", { ntags: included_tag_ids.length });
    return query;
  };

  private get_inner_query = (tags: Tag[], include_having: boolean): SelectQueryBuilder<ImageGallery> => {
    const gallery_repo = getRepository(ImageGallery);
    const tag_ids = Tag.get_ids(tags);
    let query = gallery_repo
      .createQueryBuilder("gallery")
      .select("gallery.id", "id")
      .innerJoin("gallery.tags", "tag")
      .where(`tag.id IN (${tag_ids.join(",")})`);
    if (!include_having) return query;
    return query.addGroupBy("gallery.id").having(`COUNT(DISTINCT tag.id)=${tag_ids.length}`);
  };
}
