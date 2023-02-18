import { Request, Response, query } from "express";
import { SearchQuery } from "../../lib/search_query";
import { Tag } from "../../models/tag";

export let cached_query = new SearchQuery();

export const MIN_RATING = 0;
export const MAX_RATING = 10;

export const SetCachedQuery = (req: Request, res: Response): SearchQuery => {
  console.log("entered set cached query");
  const included_tags: Tag[] = req.body.included_tags ?? [];
  const min_rating: number = req.body.min_rating ?? MIN_RATING;
  const max_rating: number = req.body.max_rating ?? MAX_RATING;
  const min_resolution: number = req.body.min_resolution ?? 0;
  cached_query = new SearchQuery(included_tags, min_rating, max_rating, min_resolution);
  console.log("query:", cached_query);
  res.json(cached_query);
  return cached_query;
};

export const GetCachedQuery = (req: Request, res: Response): SearchQuery => {
  res.json(cached_query);
  return cached_query;
};
