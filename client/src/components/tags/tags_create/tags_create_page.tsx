import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Tag } from "../../../api/agent";
import TextField from "@mui/material/TextField";
import { Button, FormControl, FormControlLabel, FormGroup, FormLabel, Radio, RadioGroup } from "@mui/material";
import TagSearcher from "../tag_popover/tag_searcher";
import ITag, { ITagCreate } from "../../../models/tag";

const TagsCreatePage = () => {
  const [tag_name, set_tag_name] = useState("");
  const [is_character, set_is_character] = useState(false);
  const [is_playlist, set_is_playlist] = useState(false);
  const [is_studio, set_is_studio] = useState(false);
  const [selected_tags, set_selected_tags] = useState<ITag[]>([]);

  const handle_name_change = (input: any) => {
    set_tag_name(input.target.value);
  };

  const handle_tags_change = (tags: ITag[]) => {
    set_selected_tags(tags);
  };

  const handle_tag_type_change = (value: string) => {
    switch (value) {
      case "default":
        set_is_character(false);
        set_is_playlist(false);
        set_is_studio(false);
        break;
      case "playlist":
        set_is_character(false);
        set_is_playlist(true);
        set_is_studio(false);
        break;
      case "character":
        set_is_character(true);
        set_is_playlist(false);
        set_is_studio(false);
        break;
      case "studio":
        set_is_character(false);
        set_is_playlist(false);
        set_is_studio(true);
        break;
    }
  };

  const on_submit = async (input: any) => {
    const tag: ITagCreate = {
      name: tag_name,
      child_tags: selected_tags,
      is_character: is_character,
      is_playlist: is_playlist,
      is_studio: is_studio,
    };
    const response = await Tag.post(tag);
    console.log(response);
    set_tag_name("");
    set_selected_tags([]);
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
            <FormControlLabel value="playlist" control={<Radio />} label="Playlist" />
            <FormControlLabel value="character" control={<Radio />} label="Character" />
            <FormControlLabel value="studio" control={<Radio />} label="Studio" />
          </RadioGroup>
        </FormControl>
        <FormLabel>Child Tags</FormLabel>
        <p>Select childs tags that will be applied to any item that this tag is applied to</p>
        <TagSearcher selected_tags={selected_tags} set_selected_tags={handle_tags_change} />
        <Button sx={{ marginTop: "10px" }} variant="contained" onClick={on_submit}>
          Submit
        </Button>
      </FormGroup>
    </div>
  );
};

export default observer(TagsCreatePage);
