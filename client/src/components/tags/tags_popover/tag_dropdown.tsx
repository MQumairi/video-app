import { MenuItem, Select } from "@mui/material";
import { useEffect, useState } from "react";
import { Tag } from "../../../api/agent";
import ITag from "../../../models/tag";

export const TagDropDown = (props: any) => {
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

  return (
    <div>
      {tags.length > 0 && (
        <Select labelId="tag-dropdown" id="tag-dropdown" label="tags" value={props.selected_tag_id ?? 1} onChange={handle_change}>
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
