import Autocomplete, { AutocompleteRenderGetTagProps } from "@mui/material/Autocomplete";
import ITag from "../../../../models/tag";
import { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import TagSelectorChip from "./tag_selector_chip";
import { Tag } from "../../../../api/agent";

interface IProps {
  selected_tags: ITag[];
  on_change: (tags: ITag[]) => void;
}

const FairnessSelector = (props: IProps) => {
  const [tag_options, set_tag_options] = useState<ITag[]>([]);

  useEffect(() => {
    const fetch_tags = async () => {
      const res = await Tag.get();
      if (res.status !== 200) return;
      set_tag_options(res.data);
    };
    fetch_tags();
  }, []);

  const remove_tag = (tag: ITag) => {
    props.on_change(props.selected_tags.filter((t) => t.id !== tag.id));
  };

  return (
    <Autocomplete
      multiple
      disablePortal
      filterSelectedOptions
      sx={{ flexGrow: "100" }}
      options={tag_options}
      getOptionLabel={(option: ITag) => option.name}
      onChange={(_, value) => props.on_change(value)}
      value={props.selected_tags}
      renderInput={(params) => <TextField label="Fairness Tags" {...params} />}
      renderTags={(values, _: AutocompleteRenderGetTagProps) => (
        <div>
          {values.map((value) => (
            <TagSelectorChip tag={value} remove_tag={remove_tag} />
          ))}
        </div>
      )}
    />
  );
};

export default FairnessSelector;
