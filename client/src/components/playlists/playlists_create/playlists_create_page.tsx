import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Playlist } from "../../../api/agent";
import FunctionButton from "../../misc/function_button";
import HrefButton from "../../misc/href_button";

const PlaylistCreatePage = () => {
  const [playlist_name, set_playlist_name] = useState("");
  const handle_change = (input: any) => {
    set_playlist_name(input.target.value);
  };
  const on_submit = async (input: any) => {
    const response = await Playlist.post(playlist_name);
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
