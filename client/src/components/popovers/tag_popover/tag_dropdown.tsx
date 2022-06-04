import { MenuItem, Select } from "@mui/material";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { Tag } from "../../../api/agent";
import ITag from "../../../models/tag";

const TagDropDown = (props: any) => {
  const [tags, set_tags] = useState<ITag[]>([]);

  const fetch_tags = async () => {
    let received_tags: ITag[] = (await Tag.get()).data;
    set_tags(received_tags);
  };

  const handle_change = async (event: any) => {
    props.set_selected_tag_id(event.target.value);
  };

  useEffect(() => {
    fetch_tags();
  }, []);

  const selector_style = {
    background: "#064669",
    color: "white",
  };

  return (
    <div>
      {tags.length > 0 && (
        <Select sx={selector_style} labelId="tag-dropdown" id="tag-dropdown" label="tags" value={props.selected_tag_id ?? 1} onChange={handle_change}>
          {tags.map((tag) => {
            return (
              <MenuItem key={tag.id} value={tag.id}>
                {tag.name}
              </MenuItem>
            );
          })}
        </Select>
      )}
    </div>
  );
};

export default observer(TagDropDown);
