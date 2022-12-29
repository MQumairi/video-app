import FunctionButton from "../../misc/function_button";
import ToggleButton from "../../misc/toggle_button";
import PlaylistDropDown from "./playlists_dropdown";
import { useContext, useState } from "react";
import IPlaylist from "../../../models/playlist";
import { Playlist } from "../../../api/agent";
import SelectedVideosStore from "../../../store/selected_videos_store";
import { observer } from "mobx-react-lite";

const PlaylistVideoPopover = (props: any) => {
  const [selected_playlist, set_selected_playlist] = useState<IPlaylist>({id: 0, name: "select", videos: []});
  const selectedVideoStore = useContext(SelectedVideosStore);

  const style = {
    background: "#022a40",
    width: "500px",
    height: "min-content",
    padding: "20px",
    margin: "auto",
  };

  const send_video = async () => {
    const videos = Array.from(selectedVideoStore.selected_videos.values());
    console.log("videos are", videos);
    await Playlist.add_videos(videos, [selected_playlist]);
  };

  return (
    <div style={style}>
      <h2>Add to Playlist</h2>
      <PlaylistDropDown selected_playlist={selected_playlist} set_selected_playlist={set_selected_playlist} />
      <p>Associate the videos with the selected playlist.</p>
      <ToggleButton toggle={selectedVideoStore.playlist_popover_visible} set_toggle={selectedVideoStore.toggle_playlist_popover} trueText="Cancel" />
      <FunctionButton fn={send_video} textContent="Submit" />
    </div>
  );
};

export default observer(PlaylistVideoPopover);
