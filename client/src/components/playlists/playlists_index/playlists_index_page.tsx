import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { Playlist } from "../../../api/agent";
import IPlaylist from "../../../models/playlist";
import HrefButton from "../../misc/href_button";
import PlaylistsList from "./playlists_list";

const PlaylistsIndexPage = () => {
  const [playlists, set_playlists] = useState<IPlaylist[]>([]);
  const fetch_playlists = async () => {
    let received_playlists = (await Playlist.get()).data;
    set_playlists(received_playlists);
  };
  useEffect(() => {
    fetch_playlists();
  }, []);
  return (
    <div>
      <h1>Playlists</h1>
      <HrefButton href="/playlists/new" textContent="Create" />
      <PlaylistsList playlists={playlists} />
    </div>
  );
};

export default observer(PlaylistsIndexPage);
