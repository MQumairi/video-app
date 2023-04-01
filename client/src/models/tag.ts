import IVideoMeta from "./video_meta";

export default interface ITag {
  id: number;
  name: string;
  videos: IVideoMeta[];
  child_tags?: ITag[];
  is_playlist: boolean;
  is_character: boolean;
  is_studio: boolean;
}

export interface ITagCreate {
  name: string;
  child_tags: ITag[];
  is_playlist: boolean;
  is_character: boolean;
  is_studio: boolean;
}

export interface ITagEdit {
  id: number;
  name: string;
  child_tags: ITag[];
  is_playlist: boolean;
  is_character: boolean;
  is_studio: boolean;
}
