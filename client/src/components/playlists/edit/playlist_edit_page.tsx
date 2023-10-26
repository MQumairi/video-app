import { observer } from "mobx-react-lite";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Tag } from "../../../api/agent";
import ITag, { ITagEdit } from "../../../models/tag";
import { Button, ButtonGroup, FormGroup, FormLabel, TextField } from "@mui/material";
import TagsStore from "../../../store/tags_store";
import DynamicPlaylistQueryPicker from "../../tags/create/dynamic_playlist_query_picker";
import IPersistentQuery from "../../../models/persistent_query";

const PlaylistEditPage = () => {
  let tag_id = useParams().tag_id ?? 1;

  const tags_store = useContext(TagsStore);

  const [tag, set_tag] = useState<ITag | null>(null);
  const [tag_name, set_tag_name] = useState("");
  const [selected_queries, set_selected_queries] = useState<IPersistentQuery[]>([]);

  const fetch_tag = async () => {
    const res = await Tag.details(+tag_id);
    if (res.status !== 200) return;
    const tag: ITag = res.data.tag;
    if (!tag.is_dynamic_playlist) return;
    set_tag_name(tag.name);
    set_tag(res.data.tag);
    set_selected_queries(res.data.queries);
  };

  const handle_name_change = (input: any) => {
    set_tag_name(input.target.value);
  };

  const on_submit = async () => {
    if (!tag_id) return;
    const edited_tag: ITagEdit = {
      id: +tag_id,
      name: tag_name,
      is_playlist: false,
      is_dynamic_playlist: true,
      is_character: false,
      is_series: false,
      is_studio: false,
      is_script: false,
      child_tags: tags_store.included_tags ?? [],
      playlist_included_tags: [],
      default_excluded: false,
      default_hidden: false,
    };
    const res = await Tag.edit(edited_tag, selected_queries);
    if (res.status !== 200) return;
  };

  useEffect(() => {
    fetch_tag();
    // eslint-disable-next-line
  }, []);

  if (!tag) return <h2>Loading tag</h2>;

  return (
    <div>
      <h1>Editing Tag: {tag.name}</h1>
      <ButtonGroup variant="contained">
        <Button href={`/playlists/${tag_id}`}>Back</Button>
        <Button onClick={fetch_tag}>Reset</Button>
      </ButtonGroup>

      <FormGroup sx={{ marginTop: "10px", gap: "10px" }}>
        <FormLabel>Name</FormLabel>
        <TextField variant="outlined" type="text" value={tag_name} onChange={handle_name_change} />
        <DynamicPlaylistQueryPicker selected_queries={selected_queries} set_selected_queries={set_selected_queries} />
        <Button sx={{ marginTop: "10px" }} variant="contained" onClick={on_submit}>
          Submit
        </Button>
      </FormGroup>
    </div>
  );
};

export default observer(PlaylistEditPage);
