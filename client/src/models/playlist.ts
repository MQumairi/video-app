import ITag from "./tag";

export interface IPlaylistCreate {
  name: string;
  included_tags: ITag[];
}

export interface IPlaylist extends IPlaylistCreate {
  id: number;
}
