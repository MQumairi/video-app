import { In, Not, getRepository } from "typeorm";
import { Tag } from "../models/tag";
import { Request } from "express";

export const MIN_RATING = 0;
export const MAX_RATING = 10;
export const MIN_RESOLUTION = 0;

export class SearchQuery {
  searched_text: string;
  included_tags: Tag[];
  excluded_tags: Tag[];
  min_rating: number;
  max_rating: number;
  min_resolution: number;
  page: number;

  constructor(
    searched_text: string = "",
    included_tags: Tag[] = [],
    excluded_tags: Tag[] = [],
    min_rating: number = 0,
    max_rating: number = 10,
    min_resolution = 0,
    page = 1
  ) {
    this.searched_text = searched_text;
    this.included_tags = included_tags;
    this.excluded_tags = excluded_tags;
    this.min_rating = min_rating;
    this.max_rating = max_rating;
    this.min_resolution = min_resolution;
    this.page = page;
  }

  static async from_request(req: Request): Promise<SearchQuery> {
    // Parse request
    const raw_text = req.query.searched_text?.toString() ?? "";
    const raw_tags = req.query.tags?.toString() ?? "";
    const raw_min_rating = req.query.minrate?.toString() ?? "0";
    const raw_max_rating = req.query.maxrate?.toString() ?? "10";
    const raw_resolution = req.query.resolution?.toString() ?? "0";
    const raw_page = req.query.page?.toString() ?? "1";
    // Find tag ids
    const tag_ids: number[] = raw_tags.split("-").map((i) => {
      return +i;
    });
    // Find rating range
    const included_tags = await getRepository(Tag).find({ where: { id: In(tag_ids) } });
    const excluded_tags = await SearchQuery.lookup_excluded_tags(included_tags);
    const min_rating: number = +raw_min_rating;
    const max_rating: number = +raw_max_rating;
    // Find resolution
    const min_resolution: number = +raw_resolution;
    // Find page
    const page: number = +raw_page;
    // Built query
    return new SearchQuery(raw_text, included_tags, excluded_tags, min_rating, max_rating, min_resolution, page);
  }

  static async from_tag(req: Request, tag: Tag): Promise<SearchQuery> {
    const raw_page = req.query.page?.toString() ?? "1";
    const page: number = +raw_page;
    const included_tags = await getRepository(Tag).find({ where: { id: tag.id } });
    const excluded_tags = await SearchQuery.lookup_excluded_tags(included_tags);
    return new SearchQuery("", included_tags, excluded_tags, MIN_RATING, MAX_RATING, MIN_RESOLUTION, page);
  }

  private static async lookup_excluded_tags(included_tags: Tag[]): Promise<Tag[]> {
    const tag_repo = getRepository(Tag);
    const included_tag_ids = Tag.get_ids(included_tags);
    const tags = await tag_repo.find({ where: { default_excluded: true, id: Not(In(included_tag_ids)) } });
    return tags;
  }
}
