import { MenuItem, Select } from "@mui/material";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import ITag from "../../models/tag";
import { Tag } from "../../api/agent";

interface IProps {
  selected_tag: ITag;
  set_selected_tag: (id: ITag) => void;
}

const TagsDropDown = (props: IProps) => {
  const [tags, set_tags] = useState<ITag[]>([]);

  const fetch_playlists = async () => {
    const res = await Tag.get();
    if (res.status != 200) return;
    set_tags(res.data);
  };

  const handle_change = async (event: any) => {
    const tag_id = event.target.value;
    for (let t of tags) {
      if (t.id != tag_id) continue;
      props.set_selected_tag(t);
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
      {tags.length > 0 && (
        <Select
          defaultValue={""}
          sx={selector_style}
          labelId="tags-dropdown"
          id="tags-dropdown"
          label="tags"
          value={props.selected_tag.id.toString()}
          onChange={handle_change}
        >
          {tags.map((t) => {
            return (
              <MenuItem key={t.id} value={t.id}>
                {t.name}
              </MenuItem>
            );
          })}
        </Select>
      )}
    </div>
  );
};

export default observer(TagsDropDown);
