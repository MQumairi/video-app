import { observer } from "mobx-react-lite";
import { useContext, useEffect, useState } from "react";
import { Video } from "../../../../api/agent";
import ITag from "../../../../models/tag";
import { TagType, get_tag_type } from "../../../../lib/tag_util";
import { FormLabel } from "@mui/material";
import TagsList from "../../../tags/util/tags_list";
import VideoStore from "../../../../store/video_store";
import VideoList from "../../util/video_list";

const TagsPanel = () => {
  const video_store = useContext(VideoStore);

  const [playlist_tags, set_playlist_tags] = useState<ITag[]>([]);
  const [character_tags, set_character_tags] = useState<ITag[]>([]);
  const [studio_tags, set_studio_tags] = useState<ITag[]>([]);
  const [default_tags, set_default_tags] = useState<ITag[]>([]);
  const [tags_count, set_tags_count] = useState<number>(0);

  const fetch_tags = async () => {
    if (!video_store.selected_video) return;
    const res = await Video.tags(video_store.selected_video);
    if (res.status !== 200) return;
    const tags: ITag[] = res.data;
    set_tags_count(tags.length);
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
    fetch_tags();
    video_store.lookup_selected_video_similar_videos();
    // eslint-disable-next-line
  }, []);

  const tag_row_style = {
    marginTop: "20px",
  };

  if (tags_count === 0) return <h2>No tags associated with this video</h2>;

  return (
    <div>
      {character_tags.length > 0 && (
        <div style={tag_row_style}>
          <FormLabel>Characters</FormLabel>
          <TagsList tags={character_tags} />
        </div>
      )}
      {default_tags.length > 0 && (
        <div style={tag_row_style}>
          <FormLabel>Tags</FormLabel>
          <TagsList tags={default_tags} />
        </div>
      )}
      {studio_tags.length > 0 && (
        <div style={tag_row_style}>
          <FormLabel>Studios</FormLabel>
          <TagsList tags={studio_tags} />
        </div>
      )}
      {playlist_tags.length > 0 && (
        <div style={tag_row_style}>
          <FormLabel>Playlists</FormLabel>
          <TagsList tags={playlist_tags} />
        </div>
      )}
      {video_store.selected_video?.created_at && (
        <div style={tag_row_style}>
          <FormLabel>Upload Date</FormLabel>
          <div> {video_store.selected_video.created_at.toString().slice(0, 10).replace(/-/g, "/")}</div>
        </div>
      )}
      {video_store.selected_video_similiar_videos.length > 1 && (
        <div style={tag_row_style}>
          <FormLabel>Similar Videos</FormLabel>
          <VideoList base="/player" videos={video_store.selected_video_similiar_videos} />
        </div>
      )}
    </div>
  );
};

export default observer(TagsPanel);
