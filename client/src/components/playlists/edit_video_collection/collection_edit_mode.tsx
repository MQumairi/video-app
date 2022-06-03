import { Box } from "@mui/material";
import IVideoMeta from "../../../models/video_meta";
import { PathConverter } from "../../../util/path_converter";
import { PlaylistVideoPopover } from "../../playlists/playlists_popover/playlists_video_popover";
import { TagVideoPopover } from "../../tags/tags_popover/tag_video_popover";
import { RemoveVideosPopover } from "../playlists_popover/remove_videos_popover";
import { CollectionEditVideoItem } from "./collection_edit_video_item";

const checked_videos = new Set<IVideoMeta>();

export const CollectionEditMode = (props: any) => {
  const modify_set = (vid: IVideoMeta) => {
    if (checked_videos.has(vid) && !props.check_all) {
      checked_videos.delete(vid);
      return;
    }
    checked_videos.add(vid);
  };

  const box_style = {
    background: "#01141f",
    display: "flex",
    flexWrap: "wrap",
    padding: "15px",
    marginTop: "20px",
  };

  return (
    <div>
      <h2 style={{ marginTop: "20px" }}>Editing Collection</h2>
      {props.tag_popover_visible && (
        <TagVideoPopover toggle={props.tag_popover_visible} set_toggle={props.set_tag_popover_visible} videos={Array.from(checked_videos)} />
      )}
      {props.playlist_popover_visible && (
        <PlaylistVideoPopover toggle={props.playlist_popover_visible} set_toggle={props.set_playlist_popover_visible} videos={Array.from(checked_videos)} />
      )}
      {props.delete_mode_visible && (
        <RemoveVideosPopover
          toggle={props.delete_mode_visible}
          set_toggle={props.set_delete_mode_visible}
          videos={Array.from(checked_videos)}
          collection_id={props.collection_id}
        />
      )}
      <Box component="div" sx={box_style}>
        {props.video_paths?.map((vid: any) => {
          return (
            <CollectionEditVideoItem
              modify_set={modify_set}
              href={`/player/${PathConverter.to_query(vid.path)}`}
              vid={vid}
              key={vid.name}
              check_all={props.check_all}
            />
          );
        })}
      </Box>
    </div>
  );
};