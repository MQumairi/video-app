import { Tag } from "../models/tag";

export class SearchQuery {
  included_tags: Tag[];
  min_rating: number;
  max_rating: number;

  constructor(included_tags: Tag[] = [], min_rating: number = 0, max_rating: number = 0) {
    this.included_tags = included_tags;
    this.min_rating = min_rating;
    this.max_rating = max_rating;
  }
}
