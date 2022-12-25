import { Request, Response } from "express";
import { SearchQuery } from "../../lib/search_query";
import { Tag } from "../../models/tag";

export let cached_query = new SearchQuery();

export const SetCachedQuery = (req: Request, res: Response): SearchQuery => {
  console.log("entered set cached query");
  const included_tags: Tag[] = req.body.included_tags ?? [];
  const min_rating: number = req.body.min_rating ?? 0;
  const max_rating: number = req.body.max_rating ?? 5;
  cached_query = new SearchQuery(included_tags, min_rating, max_rating);
  res.json(cached_query);
  return cached_query;
};

export const GetCachedQuery = (req: Request, res: Response): SearchQuery => {
  res.json(cached_query);
  return cached_query;
};
