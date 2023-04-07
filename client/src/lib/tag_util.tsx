import ITag from "../models/tag";

export enum TagType {
  Default = 1,
  Character,
  Studio,
  Playlist,
}

export const get_tag_type = (tag: ITag): TagType => {
  if (tag.is_character) return TagType.Character;
  if (tag.is_studio) return TagType.Studio;
  if (tag.is_playlist) return TagType.Playlist;
  return TagType.Default;
};
