import { Box } from "@mui/material";
import { useContext } from "react";
import { PathConverter } from "../../../util/path_converter";
import PlaylistVideoPopover from "../../popovers/playlist_popover/playlists_video_popover";
import TagVideoPopover from "../../popovers/tag_popover/tag_video_popover";
import EditModeVideoItem from "./edit_mode_video_item";
import SelectedVideosStore from "../../../store/selected_videos_store";
import { observer } from "mobx-react-lite";
import RemoveVideosPopover from "../../popovers/remove_video_popover/remove_videos_popover";

const BrowserEditMode = (props: any) => {
  const selectedVideoStore = useContext(SelectedVideosStore);

  const box_style = {
    background: "#01141f",
    display: "flex",
    flexWrap: "wrap",
    padding: "15px",
    marginTop: "20px",
  };

  return (
    <div>
      <h2 style={{ marginTop: "20px" }}>Editing, visible tagpopover: {selectedVideoStore.tag_popover_visible}</h2>
      {selectedVideoStore.tag_popover_visible && <TagVideoPopover />}
      {selectedVideoStore.playlist_popover_visible && <PlaylistVideoPopover />}
      {selectedVideoStore.remove_vid_popover_visible && <RemoveVideosPopover />}
      <Box component="div" sx={box_style}>
        {props.video_paths?.map((vid: any) => {
          return <EditModeVideoItem href={`/player/${PathConverter.to_query(vid.path)}`} vid={vid} key={vid.name} check_all={props.check_all} />;
        })}
      </Box>
    </div>
  );
};

export default observer(BrowserEditMode);
