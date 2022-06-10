import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Playlist } from "../../../api/agent";
import IVideoMeta from "../../../models/video_meta";
import FunctionButton from "../../misc/function_button";
import HrefButton from "../../misc/href_button";

const PlaylistCreatePage = () => {
  const [playlist_name, set_playlist_name] = useState("");
  const handle_change = (input: any) => {
    set_playlist_name(input.target.value);
  };
  const on_submit = async (input: any) => {
    const video_object: IVideoMeta = {
      name: playlist_name,
      path: "",
      parent_path: "",
      rating: 0
    };
    console.log("sending: ", video_object);
    const response = await Playlist.post(video_object);
    console.log(response);
    set_playlist_name("");
  };
  return (
    <div>
      <h1>New Playlist </h1>
      <HrefButton href="/playlists" textContent="Back" />
      <form onSubmit={on_submit}>
        <label>
          Name:
          <input type="text" name="name" value={playlist_name} onChange={handle_change} />
        </label>
        <FunctionButton textContent="Submit" fn={on_submit} />
      </form>
    </div>
  );
};

export default observer(PlaylistCreatePage);
