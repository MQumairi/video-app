import ITag from "./tag";

export interface IPersistentQueryCreate {
  name: string;
  included_tags: ITag[];
  excluded_tags: ITag[];
  search_text: string;
  min_rating: number;
  max_rating: number;
  min_duration_sec: number;
  max_duration_sec: number;
  frame_height: number;
}

export default interface IPersistentQuery extends IPersistentQueryCreate {
  id: number;
}

export const empty_query = (): IPersistentQuery => {
  return {
    id: -1,
    name: "None",
    included_tags: [],
    excluded_tags: [],
    search_text: "",
    min_rating: 0,
    max_rating: 0,
    min_duration_sec: 0,
    max_duration_sec: 0,
    frame_height: 0,
  };
};
