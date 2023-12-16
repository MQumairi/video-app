import { observer } from "mobx-react-lite";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Playlist } from "../../../api/agent";
import { Button, ButtonGroup, FormGroup, FormLabel, TextField } from "@mui/material";
import TagsStore from "../../../store/tags_store";
import DynamicPlaylistQueryPicker from "../../tags/create/dynamic_playlist_query_picker";
import IPersistentQuery from "../../../models/persistent_query";
import { IPlaylist } from "../../../models/playlist";

const PlaylistEditPage = () => {
  let playlist_id = useParams().playlist_id ?? 1;

  const tags_store = useContext(TagsStore);

  const [playlist, set_playlist] = useState<IPlaylist | null>(null);
  const [selected_queries, set_selected_queries] = useState<IPersistentQuery[]>([]);

  const fetch_playlist = async () => {
    const res = await Playlist.details(+playlist_id);
    if (res.status !== 200) return;
    set_playlist(res.data.playlist);
    set_selected_queries(res.data.queries);
  };

  const handle_name_change = (input: any) => {
    if (!playlist) return;
    const input_string = input.target.value;
    const new_playlist: IPlaylist = { id: playlist.id, name: input_string, included_tags: playlist.included_tags };
    set_playlist(new_playlist);
  };

  const on_submit = async () => {
    if (!playlist) return;
    const edited_playlist: IPlaylist = {
      id: playlist.id,
      name: playlist.name,
      included_tags: tags_store.included_tags ?? [],
    };
    const res = await Playlist.edit(edited_playlist, selected_queries);
    if (res.status !== 200) return;
  };

  useEffect(() => {
    fetch_playlist();
    // eslint-disable-next-line
  }, []);

  if (!playlist) return <h2>Loading playlist</h2>;

  return (
    <div>
      <h1>Editing Playlist: {playlist.name}</h1>
      <ButtonGroup variant="contained">
        <Button href={`/playlists/${playlist.id}`}>Back</Button>
        <Button onClick={fetch_playlist}>Reset</Button>
      </ButtonGroup>

      <FormGroup sx={{ marginTop: "10px", gap: "10px" }}>
        <FormLabel>Name</FormLabel>
        <TextField variant="outlined" type="text" value={playlist.name} onChange={handle_name_change} />
        <DynamicPlaylistQueryPicker selected_queries={selected_queries} set_selected_queries={set_selected_queries} />
        <Button sx={{ marginTop: "10px" }} variant="contained" onClick={on_submit}>
          Submit
        </Button>
      </FormGroup>
    </div>
  );
};

export default observer(PlaylistEditPage);
