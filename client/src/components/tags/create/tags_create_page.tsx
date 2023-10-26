import { observer } from "mobx-react-lite";
import { useContext, useState } from "react";
import { Tag } from "../../../api/agent";
import TextField from "@mui/material/TextField";
import { Button, FormControl, FormControlLabel, FormGroup, FormLabel, Radio, RadioGroup } from "@mui/material";
import TagSelector from "../util/selector/tag_selector";
import { ITagCreate } from "../../../models/tag";
import TagsStore, { TagSelectorType } from "../../../store/tags_store";
import DynamicPlaylistQueryPicker from "./dynamic_playlist_query_picker";
import IPersistentQuery from "../../../models/persistent_query";

const TagsCreatePage = () => {
  const [tag_name, set_tag_name] = useState("");
  const [is_dynamic_playlist, set_is_dynamic_playlist] = useState(false);
  const [is_character, set_is_character] = useState(false);
  const [is_series, set_is_series] = useState(false);
  const [is_studio, set_is_studio] = useState(false);
  const [is_script, set_is_script] = useState(false);
  const [selected_queries, set_selected_queries] = useState<IPersistentQuery[]>([]);

  const tags_store = useContext(TagsStore);

  const handle_name_change = (input: any) => {
    set_tag_name(input.target.value);
  };

  const handle_tag_type_change = (value: string) => {
    switch (value) {
      case "default":
        set_is_dynamic_playlist(false);
        set_is_character(false);
        set_is_series(false);
        set_is_studio(false);
        set_is_script(false);
        break;
      case "dynamic_playlist":
        set_is_dynamic_playlist(true);
        set_is_character(false);
        set_is_series(false);
        set_is_studio(false);
        set_is_script(false);
        break;
      case "character":
        set_is_dynamic_playlist(false);
        set_is_character(true);
        set_is_series(false);
        set_is_studio(false);
        set_is_script(false);
        break;
      case "series":
        set_is_dynamic_playlist(false);
        set_is_character(false);
        set_is_series(true);
        set_is_studio(false);
        set_is_script(false);
        break;
      case "studio":
        set_is_dynamic_playlist(false);
        set_is_character(false);
        set_is_series(false);
        set_is_studio(true);
        set_is_script(false);
        break;
      case "script":
        set_is_dynamic_playlist(false);
        set_is_character(false);
        set_is_series(false);
        set_is_studio(false);
        set_is_script(true);
        break;
    }
  };

  const on_submit = async (input: any) => {
    const tag: ITagCreate = {
      name: tag_name,
      child_tags: tags_store.included_tags,
      playlist_included_tags: [],
      is_playlist: false,
      is_dynamic_playlist,
      is_character,
      is_series,
      is_studio,
      is_script,
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
      <h1>New Tag</h1>
      <Button variant="contained" href="/tags">
        Back
      </Button>
      <FormGroup sx={{ marginTop: "10px", gap: "10px" }}>
        <TextField variant="outlined" type="text" value={tag_name} onChange={handle_name_change} label="Tag Name" />
        <FormControl>
          <FormLabel>Tag Type</FormLabel>
          <RadioGroup
            row
            defaultValue="default"
            name="radio-buttons-group"
            onChange={(_, value) => {
              handle_tag_type_change(value);
            }}
          >
            <FormControlLabel value="default" control={<Radio />} label="Default" />
            <FormControlLabel value="dynamic_playlist" control={<Radio />} label="Dynamic Playlist" />
            <FormControlLabel value="character" control={<Radio />} label="Character" />
            <FormControlLabel value="series" control={<Radio />} label="Series" />
            <FormControlLabel value="studio" control={<Radio />} label="Studio" />
            <FormControlLabel value="script" control={<Radio />} label="Script" />
          </RadioGroup>
        </FormControl>
        {is_dynamic_playlist && <DynamicPlaylistQueryPicker selected_queries={selected_queries} set_selected_queries={set_selected_queries} />}
        <FormLabel>Child Tags</FormLabel>
        <p>Select childs tags that will be applied to any item that this tag is applied to</p>
        <TagSelector selector_type={TagSelectorType.IncludedTags} />
        <Button sx={{ marginTop: "10px" }} variant="contained" onClick={on_submit}>
          Submit
        </Button>
      </FormGroup>
    </div>
  );
};

export default observer(TagsCreatePage);
