import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import IVideoMeta from "../../models/video_meta";
import { Video } from "../../api/agent";
import ITag from "../../models/tag";
import VideoTags from "./video_tags";
import { TagType, get_tag_type } from "../../lib/tag_util";
import { FormLabel } from "@mui/material";

interface IProps {
  video: IVideoMeta;
}

const TagsPanel = (props: IProps) => {
  const [playlist_tags, set_playlist_tags] = useState<ITag[]>([]);
  const [character_tags, set_character_tags] = useState<ITag[]>([]);
  const [studio_tags, set_studio_tags] = useState<ITag[]>([]);
  const [default_tags, set_default_tags] = useState<ITag[]>([]);

  const fetch_scripts = async () => {
    const res = await Video.tags(props.video);
    if (res.status !== 200) return;
    const tags: ITag[] = res.data;

    const res_playlist_tags: ITag[] = [];
    const res_character_tags: ITag[] = [];
    const res_studio_tags: ITag[] = [];
    const res_default_tags: ITag[] = [];
    for (const t of tags) {
      switch (get_tag_type(t)) {
        case TagType.Playlist:
          res_playlist_tags.push(t);
          break;
        case TagType.Character:
          res_character_tags.push(t);
          break;
        case TagType.Studio:
          res_studio_tags.push(t);
          break;
        case TagType.Default:
          res_default_tags.push(t);
          break;
      }
    }
    set_playlist_tags(res_playlist_tags);
    set_character_tags(res_character_tags);
    set_studio_tags(res_studio_tags);
    set_default_tags(res_default_tags);
  };

  useEffect(() => {
    fetch_scripts();
    // eslint-disable-next-line
  }, []);

  const tag_row_style = {
    marginTop: "20px",
  };

  return (
    <div>
      <div style={tag_row_style}>
        <FormLabel>Characters</FormLabel>
        <VideoTags tags={character_tags} />
      </div>
      <div style={tag_row_style}>
        <FormLabel>Tags</FormLabel>
        <VideoTags tags={default_tags} />
      </div>
      <div style={tag_row_style}>
        <FormLabel>Studios</FormLabel>
        <VideoTags tags={studio_tags} />
      </div>
      <div style={tag_row_style}>
        <FormLabel>Playlists</FormLabel>
        <VideoTags tags={playlist_tags} />
      </div>
    </div>
  );
};

export default observer(TagsPanel);
