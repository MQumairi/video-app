import { observer } from "mobx-react-lite";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Playlist } from "../../../api/agent";
import { Button, ButtonGroup, FormGroup, FormLabel, TextField } from "@mui/material";
import TagsStore, { TagSelectorType } from "../../../store/tags_store";
import TagSelector from "../../tags/util/selector/tag_selector";
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
    const fetched_playlist: IPlaylist = res.data.playlist;
    set_playlist(fetched_playlist);
    set_selected_queries(res.data.queries);
    tags_store.set_selected_tags(TagSelectorType.IncludedTags, fetched_playlist.included_tags ?? []);
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
      included_tags: tags_store.get_selected_tags(TagSelectorType.IncludedTags),
    };
    const res = await Playlist.edit(edited_playlist, selected_queries);
    if (res.status !== 200) return;
    await fetch_playlist();
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
        <FormGroup sx={{ marginTop: "10px" }}>
          <FormLabel>Tags to Include in All Videos</FormLabel>
          <TagSelector selector_type={TagSelectorType.IncludedTags} />
        </FormGroup>
        <DynamicPlaylistQueryPicker selected_queries={selected_queries} set_selected_queries={set_selected_queries} />
        <Button sx={{ marginTop: "10px" }} variant="contained" onClick={on_submit}>
          Submit
        </Button>
      </FormGroup>
    </div>
  );
};

export default observer(PlaylistEditPage);
