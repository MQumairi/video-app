import ITag from "./tag";

export default interface IAdvancedSearchQuery {
  included_tags: ITag[];
  min_rating: number;
}
