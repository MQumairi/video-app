import IVideoMeta from "./video_meta";

export default interface ITag {
  id: number;
  name: string;
  videos: IVideoMeta[];
  child_tags?: ITag[];
  is_playlist: boolean;
  is_dynamic_playlist: boolean;
  is_character: boolean;
  is_series: boolean;
  is_studio: boolean;
  is_script: boolean;
  default_excluded: boolean;
  default_hidden: boolean;
}

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

export interface ITagEdit {
  id: number;
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
