import IPersistentQuery from "./persistent_query";
import IVideoMeta from "./video_meta";

export interface ITagCreate {
  name: string;
  child_tags: ITag[];
  is_playlist: boolean;
  is_dynamic_playlist: boolean;
  is_character: boolean;
  is_series: boolean;
  is_studio: boolean;
  is_script: boolean;
  default_excluded: boolean;
  default_hidden: boolean;
}

export interface ITagEdit extends ITagCreate {
  id: number;
}

export default interface ITag extends ITagEdit {
  videos: IVideoMeta[];
}
