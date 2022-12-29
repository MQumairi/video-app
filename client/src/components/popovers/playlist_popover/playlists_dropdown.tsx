import { MenuItem, Select } from "@mui/material";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { Playlist } from "../../../api/agent";
import IPlaylist from "../../../models/playlist";

interface IProps {
  selected_playlist: IPlaylist;
  set_selected_playlist: (id: IPlaylist) => void;
}

const PlaylistDropDown = (props: IProps) => {
  const [playlists, set_playlists] = useState<IPlaylist[]>([]);

  const fetch_playlists = async () => {
    let received_playlists: IPlaylist[] = (await Playlist.get()).data;
    set_playlists(received_playlists);
  };

  const handle_change = async (event: any) => {
    const playlist_id = event.target.value;
    for (let p of playlists) {
      if (p.id != playlist_id) continue;
      props.set_selected_playlist(p);
    }
  };

  useEffect(() => {
    fetch_playlists();
  }, []);

  const selector_style = {
    background: "#064669",
    color: "white",
  };

  return (
    <div>
      {playlists.length > 0 && (
        <Select
          defaultValue={""}
          sx={selector_style}
          labelId="playlist-dropdown"
          id="playlist-dropdown"
          label="playlists"
          value={props.selected_playlist.id.toString()}
          onChange={handle_change}
        >
          {playlists.map((playlist) => {
            return (
              <MenuItem key={playlist.id} value={playlist.id}>
                {playlist.name}
              </MenuItem>
            );
          })}
        </Select>
      )}
    </div>
  );
};

export default observer(PlaylistDropDown);
