import Autocomplete, { AutocompleteRenderGetTagProps } from "@mui/material/Autocomplete";
import ITag from "../../../../models/tag";
import { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import TagSelectorChip from "./tag_selector_chip";
import { Tag } from "../../../../api/agent";

interface IProps {
  selected_studios: ITag[];
  on_change: (studios: ITag[]) => void;
}

const StudioSelector = (props: IProps) => {
  const [studio_options, set_studio_options] = useState<ITag[]>([]);

  useEffect(() => {
    const fetch_studios = async () => {
      const res = await Tag.studios();
      if (res.status !== 200) return;
      set_studio_options(res.data);
    };
    fetch_studios();
  }, []);

  const remove_studio = (tag: ITag) => {
    props.on_change(props.selected_studios.filter((s) => s.id !== tag.id));
  };

  return (
    <Autocomplete
      multiple
      disablePortal
      filterSelectedOptions
      sx={{ flexGrow: "100" }}
      options={studio_options}
      getOptionLabel={(option: ITag) => option.name}
      onChange={(_, value) => props.on_change(value)}
      value={props.selected_studios}
      renderInput={(params) => <TextField label="Studios" {...params} />}
      renderTags={(values, _: AutocompleteRenderGetTagProps) => (
        <div>
          {values.map((value) => (
            <TagSelectorChip tag={value} remove_tag={remove_studio} />
          ))}
        </div>
      )}
    />
  );
};

export default StudioSelector;
