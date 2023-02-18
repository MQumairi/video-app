import ITag from "./tag";

export default interface IAdvancedSearchQuery {
  included_tags: ITag[];
  min_rating: number;
  max_rating: number;
  min_resolution: number;
}
