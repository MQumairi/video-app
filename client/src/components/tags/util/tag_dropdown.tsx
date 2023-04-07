import { MenuItem, Select } from "@mui/material";
import { observer } from "mobx-react-lite";
import { useContext, useEffect } from "react";
import TagsStore from "../../../store/tags_store";

interface IProps {
  set_selected_tag_id: (id: number) => void;
  selected_tag_id: number;
}

const TagDropDown = (props: IProps) => {
  const tags_store = useContext(TagsStore);

  const handle_change = async (event: any) => {
    props.set_selected_tag_id(event.target.value);
  };

  useEffect(() => {
    tags_store.lookup();
    // eslint-disable-next-line
  }, []);

  const selector_style = {
    background: "#064669",
    color: "white",
  };

  if (tags_store.tags.length === 0) return <div></div>;

  return (
    <div>
      <Select sx={selector_style} labelId="tag-dropdown" id="tag-dropdown" label="tags" value={props.selected_tag_id ?? 1} onChange={handle_change}>
        {tags_store.tags.map((tag) => {
          return (
            <MenuItem key={tag.id} value={tag.id}>
              {tag.name}
            </MenuItem>
          );
        })}
      </Select>
    </div>
  );
};

export default observer(TagDropDown);
