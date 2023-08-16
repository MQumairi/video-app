import { observer } from "mobx-react-lite";
import { useContext, useState } from "react";
import { Tag } from "../../../api/agent";
import TextField from "@mui/material/TextField";
import { Button, FormGroup } from "@mui/material";
import { ITagCreate } from "../../../models/tag";
import TagsStore, { TagSelectorType } from "../../../store/tags_store";
import IPersistentQuery from "../../../models/persistent_query";
import DynamicPlaylistQueryPicker from "../../tags/create/dynamic_playlist_query_picker";

const PlaylistCreatePage = () => {
  const [tag_name, set_tag_name] = useState("");
  const [selected_queries, set_selected_queries] = useState<IPersistentQuery[]>([]);

  const tags_store = useContext(TagsStore);

  const handle_name_change = (input: any) => {
    set_tag_name(input.target.value);
  };

  const on_submit = async (input: any) => {
    const tag: ITagCreate = {
      name: tag_name,
      child_tags: [],
      is_playlist: false,
      is_dynamic_playlist: true,
      is_character: false,
      is_series: false,
      is_studio: false,
      is_script: false,
      default_excluded: false,
      default_hidden: false,
    };
    // Passing in selected_queries in case this tag is a dynamic playlist
    await Tag.create(tag, selected_queries);
    set_tag_name("");
    tags_store.set_selected_tags(TagSelectorType.IncludedTags, []);
  };
  return (
    <div>
      <h1>New Playlist</h1>
      <Button variant="contained" href="/playlists?tags_index_tab=0">
        Back
      </Button>
      <FormGroup sx={{ marginTop: "10px", gap: "10px" }}>
        <TextField variant="outlined" type="text" value={tag_name} onChange={handle_name_change} label="Tag Name" />
        <DynamicPlaylistQueryPicker selected_queries={selected_queries} set_selected_queries={set_selected_queries} />
        <Button sx={{ marginTop: "10px" }} variant="contained" onClick={on_submit}>
          Submit
        </Button>
      </FormGroup>
    </div>
  );
};

export default observer(PlaylistCreatePage);
