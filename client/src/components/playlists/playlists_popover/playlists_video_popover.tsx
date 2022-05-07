import { FunctionButton } from "../../misc/function_button";
import { ToggleButton } from "../../misc/toggle_button";
import { PlaylistDropDown } from "./playlists_dropdown";
import { useState } from "react";
import IPlaylist from "../../../models/playlist";
import { Playlist } from "../../../api/agent";

export const PlaylistVideoPopover = (props: any) => {
  const [selected_playlist_id, set_selected_playlist_id] = useState<number>(1);

  const style = {
    background: "#022a40",
    width: "500px",
    height: "min-content",
    padding: "20px",
    margin: "auto",
  };

  const send_video = async () => {
    const videos = props.videos;
    console.log("videos are", videos);
    const updated_playlist: IPlaylist = {
      id: selected_playlist_id,
      name: "",
      videos: videos,
    };
    await Playlist.add_video(updated_playlist);
  };

  return (
    <div style={style}>
      <h2>Add to Playlist</h2>
      <PlaylistDropDown selected_playlist_id={selected_playlist_id} set_selected_playlist_id={set_selected_playlist_id} />
      <p>Associate the videos with the selected playlist.</p>
      <ToggleButton toggle={props.toggle} set_toggle={props.set_toggle} trueText="Cancel" />
      <FunctionButton fn={send_video} textContent="Submit" />
    </div>
  );
};
