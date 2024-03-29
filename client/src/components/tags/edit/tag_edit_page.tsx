import { observer } from "mobx-react-lite";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Tag } from "../../../api/agent";
import ITag, { ITagEdit } from "../../../models/tag";
import { Button, ButtonGroup, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Radio, RadioGroup, TextField } from "@mui/material";
import TagSelector from "../util/selector/tag_selector";
import TagsStore, { TagSelectorType } from "../../../store/tags_store";
import DynamicPlaylistQueryPicker from "../create/dynamic_playlist_query_picker";
import IPersistentQuery from "../../../models/persistent_query";

const TagEditPage = () => {
  let tag_id = useParams().tag_id ?? 1;
  const [tag, set_tag] = useState<ITag | null>(null);

  const tags_store = useContext(TagsStore);

  const [tag_name, set_tag_name] = useState("");
  const [tag_type, set_tag_type] = useState("default");
  const [is_dynamic_playlist, set_is_dynamic_playlist] = useState(false);
  const [is_character, set_is_character] = useState(false);
  const [is_series, set_is_series] = useState(false);
  const [is_studio, set_is_studio] = useState(false);
  const [is_script, set_is_script] = useState(false);
  const [default_excluded, set_default_excluded] = useState<boolean>(false);
  const [default_hidden, set_default_hidden] = useState<boolean>(false);
  const [should_generate_thumbs, set_should_generate_thumbs] = useState<boolean>(false);
  const [selected_queries, set_selected_queries] = useState<IPersistentQuery[]>([]);

  const fetch_tag = async () => {
    const res = await Tag.details(+tag_id);
    if (res.status !== 200) return;
    const tag: ITag = res.data.tag;
    set_tag_name(tag.name);
    if (tag.is_dynamic_playlist) {
      set_is_dynamic_playlist(tag.is_dynamic_playlist);
      set_tag_type("dynamic_playlist");
      set_selected_queries(res.data.queries);
    } else if (tag.is_character) {
      set_is_character(tag.is_character);
      set_tag_type("character");
    } else if (tag.is_series) {
      set_is_series(tag.is_series);
      set_tag_type("series");
    } else if (tag.is_studio) {
      set_is_studio(tag.is_studio);
      set_tag_type("studio");
    } else if (tag.is_script) {
      set_is_script(tag.is_script);
      set_tag_type("script");
    }
    if (tag.child_tags) tags_store.set_selected_tags(TagSelectorType.IncludedTags, tag.child_tags);
    set_tag(res.data.tag);
    set_default_excluded(tag.default_excluded);
    set_default_hidden(tag.default_hidden);
  };

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
      case "playlist":
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
    set_tag_type(value);
  };

  const on_submit = async () => {
    if (!tag_id) return;
    const edited_tag: ITagEdit = {
      id: +tag_id,
      name: tag_name,
      is_playlist: false,
      is_dynamic_playlist: is_dynamic_playlist,
      is_character: is_character,
      is_series: is_series,
      is_studio: is_studio,
      is_script: is_script,
      child_tags: tags_store.included_tags ?? [],
      playlist_included_tags: [],
      default_excluded: default_excluded,
      default_hidden: default_hidden,
    };
    const res = await Tag.edit(edited_tag, selected_queries);
    if (res.status !== 200) return;
    const saved_tag: ITag = res.data;
    if (should_generate_thumbs) {
      await Tag.generate_video_thumbnails(saved_tag);
    }
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
        <Button href={`/tags/${tag_id}`}>Back</Button>
        <Button onClick={fetch_tag}>Reset</Button>
      </ButtonGroup>

      <FormGroup sx={{ marginTop: "10px", gap: "10px" }}>
        <FormLabel>Name</FormLabel>
        <TextField variant="outlined" type="text" value={tag_name} onChange={handle_name_change} />

        <FormControl>
          <FormLabel>Tag Type</FormLabel>
          <RadioGroup
            row
            defaultValue="default"
            value={tag_type}
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
        <p style={{ marginBottom: "10px" }}>Select childs tags that will be applied to any item that this tag is applied to</p>
        <TagSelector selector_type={TagSelectorType.IncludedTags} />
        <FormLabel>Exclude Items from search unless this tag is explicitly searched for</FormLabel>
        <FormControlLabel
          control={
            <Checkbox
              defaultChecked={default_excluded}
              style={{ color: "white" }}
              value={default_excluded}
              onChange={(_, checked) => {
                set_default_excluded(checked);
              }}
            />
          }
          label="Default Excluded from Search"
        />
        <FormLabel>Exclude Items from homepage</FormLabel>
        <FormControlLabel
          control={
            <Checkbox
              defaultChecked={default_hidden}
              style={{ color: "white" }}
              value={default_hidden}
              onChange={(_, checked) => {
                set_default_hidden(checked);
              }}
            />
          }
          label="Default Hidden from Home Page"
        />
        <FormLabel>Generate Thumbs for All Tagged Videos</FormLabel>
        <FormControlLabel
          control={
            <Checkbox
              style={{ color: "white" }}
              value={should_generate_thumbs}
              onChange={(_, checked) => {
                set_should_generate_thumbs(checked);
              }}
            />
          }
          label="Generate"
        />
        <Button sx={{ marginTop: "10px" }} variant="contained" onClick={on_submit}>
          Submit
        </Button>
      </FormGroup>
    </div>
  );
};

export default observer(TagEditPage);
