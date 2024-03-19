import { In, Not, getRepository } from "typeorm";
import { Tag } from "../models/tag";
import { Request } from "express";
import { Playlist } from "../models/playlist";

export const MIN_RATING = 0;
export const MAX_RATING = 10;
export const MIN_RESOLUTION = 0;

export enum ThumbStatus {
  default = 0,
  withThumb,
  noThumb,
}

export class SearchQuery {
  searched_text: string;
  included_tags: Tag[];
  excluded_tags: Tag[];
  min_rating: number;
  max_rating: number;
  min_resolution: number;
  page: number;
  order_by: string;
  order_strategy: "ASC" | "DESC" | undefined;
  page_capacity: number;
  thumb_status: ThumbStatus;

  constructor(
    searched_text: string = "",
    included_tags: Tag[] = [],
    excluded_tags: Tag[] = [],
    min_rating: number = 0,
    max_rating: number = 10,
    min_resolution = 0,
    page = 1,
    page_capacity = 12,
    order_by = "path",
    order_strategy: "ASC" | "DESC" = "ASC",
    thumb_status: ThumbStatus = ThumbStatus.default
  ) {
    this.searched_text = searched_text;
    this.included_tags = included_tags;
    this.excluded_tags = excluded_tags;
    this.min_rating = min_rating;
    this.max_rating = max_rating;
    this.min_resolution = min_resolution;
    this.page = page;
    this.order_by = order_by;
    this.order_strategy = order_strategy;
    this.page_capacity = page_capacity;
    this.thumb_status = thumb_status;
  }

  private static extract_tags(tags_string: string): number[] {
    if (!tags_string.length) return [];
    const tag_ids = tags_string.split("-").map((i) => {
      return isNaN(+i) ? -1 : +i;
    });
    if (tag_ids.includes(-1)) return [];
    return tag_ids;
  }

  static async from_request(req: Request, exclude_default_tags = true): Promise<SearchQuery> {
    // Parse request
    const raw_text = req.query.searched_text?.toString() ?? "";
    const raw_tags = req.query.tags?.toString() ?? "";
    const raw_excluded_tags = req.query.excluded_tags?.toString() ?? "";
    const raw_min_rating = req.query.minrate?.toString() ?? "0";
    const raw_max_rating = req.query.maxrate?.toString() ?? "10";
    const raw_resolution = req.query.resolution?.toString() ?? "0";
    const raw_page = req.query.page?.toString() ?? "1";
    const sort = req.query.sort?.toString() ?? "path";
    const raw_results_per_page = req.query.results_per_page?.toString() ?? "12";
    // Find tag ids
    const tag_ids: number[] = SearchQuery.extract_tags(raw_tags);
    const excluded_tag_ids: number[] = SearchQuery.extract_tags(raw_excluded_tags);
    // Find rating range
    const included_tags = await getRepository(Tag).find({ where: { id: In(tag_ids) } });
    const excluded_tags = exclude_default_tags
      ? await SearchQuery.lookup_excluded_tags_from_ids(excluded_tag_ids, included_tags)
      : await getRepository(Tag).find({ where: { id: In(excluded_tag_ids) } });
    const min_rating: number = isNaN(+raw_min_rating) ? 0 : +raw_min_rating;
    const max_rating: number = isNaN(+raw_max_rating) ? 10 : +raw_max_rating;
    // Find resolution
    const min_resolution: number = isNaN(+raw_resolution) ? 0 : +raw_resolution;
    // Find page
    const page: number = isNaN(+raw_page) ? 1 : +raw_page;
    // Sort option
    const sort_option = SearchQuery.sort_option_to_video_field(sort);
    // Results per page
    const results_per_page = isNaN(+raw_results_per_page) ? 12 : +raw_results_per_page;
    // Built query
    return new SearchQuery(
      raw_text,
      included_tags,
      excluded_tags,
      min_rating,
      max_rating,
      min_resolution,
      page,
      results_per_page,
      sort_option,
      SearchQuery.get_sorting_strategy(sort_option),
      ThumbStatus.default
    );
  }

  static async from_tag(req: Request, tag: Tag, limit: number = 12, thumb_status: ThumbStatus = ThumbStatus.default): Promise<SearchQuery> {
    const raw_page = req.query.page?.toString() ?? "1";
    const page: number = +raw_page;
    const included_tags = await getRepository(Tag).find({ where: { id: tag.id } });
    return new SearchQuery("", included_tags, [], MIN_RATING, MAX_RATING, MIN_RESOLUTION, page, limit, "path", "ASC", thumb_status);
  }

  static async from_playlist(req: Request, playlist: Playlist, limit: number = 12, thumb_status: ThumbStatus = ThumbStatus.default): Promise<SearchQuery> {
    const raw_page = req.query.page?.toString() ?? "1";
    const page: number = +raw_page;
    return new SearchQuery("", playlist.included_tags, [], MIN_RATING, MAX_RATING, MIN_RESOLUTION, page, limit, "path", "ASC", thumb_status);
  }

  private static async lookup_excluded_tags_from_ids(excluded_tag_ids: number[], included_tags: Tag[]): Promise<Tag[]> {
    const tag_repo = getRepository(Tag);
    const included_tag_ids = Tag.get_ids(included_tags);
    const tags = await tag_repo.find({
      where: [{ default_excluded: true, id: Not(In(included_tag_ids)) }, { id: In(excluded_tag_ids) }],
    });
    return tags;
  }

  static async lookup_excluded_tags(excluded_tags: Tag[], included_tags: Tag[]): Promise<Tag[]> {
    const tag_repo = getRepository(Tag);
    const excluded_tag_ids = Tag.get_ids(excluded_tags);
    const included_tag_ids = Tag.get_ids(included_tags);
    const tags = await tag_repo.find({
      where: [{ default_excluded: true, id: Not(In(included_tag_ids)) }, { id: In(excluded_tag_ids) }],
    });
    return tags;
  }

  private static sort_option_to_video_field(sort_option: string): string {
    const option_map = new Map<string, string>();
    option_map.set("Path", "path");
    option_map.set("Name", "name");
    option_map.set("Rating", "rating");
    option_map.set("Latest", "created_at");
    option_map.set("Views", "views");
    option_map.set("Length", "duration_sec");
    option_map.set("Size", "size_mb");
    option_map.set("Thumb", "thumbnail");
    option_map.set("Rated Value", "rating_size_value");
    const res = option_map.get(sort_option);
    return res ?? "path";
  }

  private static get_sorting_strategy(sort_option: string): "ASC" | "DESC" {
    switch (sort_option) {
      case "path":
        return "ASC";
      case "name":
        return "ASC";
      case "rating":
        return "DESC";
      case "created_at":
        return "DESC";
      case "views":
        return "DESC";
      case "duration_sec":
        return "DESC";
      case "size_mb":
        return "DESC";
      case "thumbnail":
        return "ASC";
      case "rating_size_value":
        return "DESC";
      default:
        return "ASC";
    }
  }
}
