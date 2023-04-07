import Autocomplete, { AutocompleteRenderGetTagProps } from "@mui/material/Autocomplete";
import ITag from "../../../../models/tag";
import { useContext, useEffect } from "react";
import { TextField } from "@mui/material";
import TagSearcherChip from "./tag_searcher_chip";
import TagsStore from "../../../../store/tags_store";
import { observer } from "mobx-react-lite";

interface IProps {
  post_selection?: () => void;
  post_deselection?: () => void;
}

const TagSearcher = (props: IProps) => {
  const tags_store = useContext(TagsStore);

  const add_tags = (tags: ITag[]) => {
    tags_store.set_selected_tags(tags);
    if (props.post_selection) props.post_selection();
  };

  const remove_tag = (tag: ITag) => {
    tags_store.deselect(tag);
    if (props.post_deselection) props.post_deselection();
  };

  useEffect(() => {
    tags_store.lookup();
    // eslint-disable-next-line
  }, []);

  return (
    <Autocomplete
      multiple
      disablePortal
      filterSelectedOptions
      id="combo-box-demo"
      sx={{ flexGrow: "100" }}
      options={tags_store.tags}
      getOptionLabel={(option: ITag) => {
        return option.name;
      }}
      onChange={(_, value) => add_tags(value)}
      value={tags_store.selected_tags}
      renderInput={(params) => <TextField label="Selected Tags" {...params} />}
      renderTags={(values, _: AutocompleteRenderGetTagProps) => {
        return (
          <div>
            {values.map((value) => (
              <TagSearcherChip tag={value} remove_tag={remove_tag} />
            ))}
          </div>
        );
      }}
    />
  );
};

export default observer(TagSearcher);
