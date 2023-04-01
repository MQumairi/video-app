import { In, getRepository } from "typeorm";
import { Tag } from "../models/tag";
import { Request } from "express";

export const MIN_RATING = 0;
export const MAX_RATING = 10;
export const MIN_RESOLUTION = 0;

export class SearchQuery {
  included_tags: Tag[];
  min_rating: number;
  max_rating: number;
  min_resolution: number;
  page: number;

  constructor(included_tags: Tag[] = [], min_rating: number = 0, max_rating: number = 10, min_resolution = 0, page = 1) {
    this.included_tags = included_tags;
    this.min_rating = min_rating;
    this.max_rating = max_rating;
    this.min_resolution = min_resolution;
    this.page = page;
  }

  static async from_request(req: Request): Promise<SearchQuery> {
    console.log("query:", req.query);
    // Parse request
    const raw_tags = req.query.tags?.toString() ?? "";
    const raw_min_rating = req.query.minrate?.toString() ?? "0";
    const raw_max_rating = req.query.maxrate?.toString() ?? "10";
    const raw_resolution = req.query.resolution?.toString() ?? "0";
    const raw_page = req.query.page?.toString() ?? "1";
    // Find tags
    const tag_ids: number[] = raw_tags.split("-").map((i) => {
      return +i;
    });
    // Find rating range
    const tags = await getRepository(Tag).find({ where: { id: In(tag_ids) } });
    const min_rating: number = +raw_min_rating;
    const max_rating: number = +raw_max_rating;
    // Find resolution
    const min_resolution: number = +raw_resolution;
    // Find page
    const page: number = +raw_page;
    // Built query
    return new SearchQuery(tags, min_rating, max_rating, min_resolution, page);
  }

  static async from_tag(req: Request, tag: Tag): Promise<SearchQuery> {
    const raw_page = req.query.page?.toString() ?? "1";
    const page: number = +raw_page;
    const tags = await getRepository(Tag).find({ where: { id: tag.id } });
    return new SearchQuery(tags, MIN_RATING, MAX_RATING, MIN_RESOLUTION, page);
  }
}
