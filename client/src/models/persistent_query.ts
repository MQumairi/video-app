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
