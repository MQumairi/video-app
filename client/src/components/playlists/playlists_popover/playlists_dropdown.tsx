import { MenuItem, Select } from "@mui/material";
import { useEffect, useState } from "react";
import { Playlist } from "../../../api/agent";
import IPlaylist from "../../../models/playlist";

export const PlaylistDropDown = (props: any) => {
  const [playlists, set_playlists] = useState<IPlaylist[]>([]);

  const fetch_playlists = async () => {
    let received_playlists: IPlaylist[] = (await Playlist.get()).data;
    set_playlists(received_playlists);
  };

  const handle_change = async (event: any) => {
    props.set_selected_playlist_id(event.target.value);
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
        <Select sx={selector_style} labelId="playlist-dropdown" id="playlist-dropdown" label="playlists" value={props.selected_playlist_id ?? 1} onChange={handle_change}>
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