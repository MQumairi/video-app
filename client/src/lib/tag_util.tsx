import ITag from "../models/tag";

export enum TagType {
  Default = 1,
  Character,
  Studio,
  Playlist,
  Series,
  Script,
}

export const get_tag_type = (tag: ITag): TagType => {
  if (tag.is_character) return TagType.Character;
  if (tag.is_studio) return TagType.Studio;
  if (tag.is_playlist) return TagType.Playlist;
  if (tag.is_series) return TagType.Series;
  if (tag.is_script) return TagType.Script;
  return TagType.Default;
};
