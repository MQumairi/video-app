import ITag from "./tag";

export default interface ISearchQuery {
  searched_text: string;
  included_tags: ITag[];
  min_rating: number;
  max_rating: number;
  min_resolution: number;
}
