import { ButtonGroup } from "@mui/material";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Playlist } from "../../../api/agent";
import IPlaylist from "../../../models/playlist";
import FunctionButton from "../../misc/function_button";
import HrefButton from "../../misc/href_button";

const PlaylistsDeletePage = () => {
  let playlist_id = useParams().playlist_id;
  const [playlist, set_playlist] = useState<IPlaylist | null>(null);

  const fetch_playlist = async () => {
    if (!playlist_id) {
      return;
    }
    let response: IPlaylist = (await Playlist.details(+playlist_id)).data;
    set_playlist(response);
  };

  const handle_playlist_delete = async () => {
    console.log("attempting to delete playlist");
    if (playlist_id) {
      await Playlist.delete(+playlist_id);
    }
  };

  useEffect(() => {
    fetch_playlist();
  }, []);

  return (
    <div>
      <h1>Are you sure you want to delete the "{playlist?.name}" playlist?</h1>
      <ButtonGroup>
        <HrefButton href={"/playlists"} textContent="Back" />
        <FunctionButton fn={handle_playlist_delete} textContent="Delete" />
      </ButtonGroup>
    </div>
  );
};

export default observer(PlaylistsDeletePage);
