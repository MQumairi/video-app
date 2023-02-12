import Autocomplete, { AutocompleteRenderGetTagProps } from "@mui/material/Autocomplete";
import ITag from "../../../models/tag";
import { useContext } from "react";
import SelectedVideosStore from "../../../store/selected_videos_store";
import { Chip, TextField } from "@mui/material";

interface IProps {
  tags: ITag[];
}

const TagSearcher: React.FC<IProps> = (props: IProps) => {
  const selectedVideoStore = useContext(SelectedVideosStore);

  const add_tag = (event: any) => {
    const tag_name = event.target.innerText;
    if (tag_name == "") return;
    console.log("adding tag name:", tag_name);
    selectedVideoStore.add_searched_for_tag(tag_name);
  };

  const remove_tag = (tag: ITag) => {
    const tag_name = tag.name;
    if (tag_name == "") return;
    console.log("removing tag name:", tag_name);
    selectedVideoStore.remove_searched_for_tag(tag_name);
  };

  return (
    <Autocomplete
      multiple
      disablePortal
      filterSelectedOptions
      id="combo-box-demo"
      options={props.tags}
      onChange={(e) => {
        console.log("onChange event:", e);
        add_tag(e);
      }}
      getOptionLabel={(option: ITag) => {
        return option.name;
      }}
      value={selectedVideoStore.searched_for_tags}
      sx={{ background: "white", borderRadius: "5px" }}
      renderInput={(params) => <TextField {...params} />}
      renderTags={(values, _: AutocompleteRenderGetTagProps) => {
        return (
          <div>
            {values.map((value) => (
              <Chip
                sx={{ marginLeft: "5px" }}
                key={value.name}
                label={value.name}
                onDelete={() => {
                  remove_tag(value);
                }}
              />
            ))}
          </div>
        );
      }}
    />
  );
};

export default TagSearcher;
