import Autocomplete, { AutocompleteRenderGetTagProps } from "@mui/material/Autocomplete";
import ITag from "../../../models/tag";
import { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import TagSearcherChip from "./tag_searcher_chip";
import { Tag } from "../../../api/agent";

interface IProps {
  selected_tags: ITag[];
  set_selected_tags: (tags: ITag[]) => void;
}

const TagSearcher: React.FC<IProps> = (props: IProps) => {
  const [tags, set_tags] = useState<ITag[]>([]);

  const remove_tag_object = (tag: ITag) => {
    const new_tags: ITag[] = [];
    for (let i = 0; i < props.selected_tags.length; i++) {
      const t = props.selected_tags[i];
      if (t.id != tag.id) {
        new_tags.push(t);
      }
    }
    props.set_selected_tags(new_tags);
  };

  const fetch_tags = async () => {
    console.log("fetching tags for tag_searcher");
    let res = await Tag.get();
    if (res.status != 200) return;
    console.log("received 200 response");
    set_tags(res.data);
  };

  useEffect(() => {
    fetch_tags();
  }, []);

  return (
    <Autocomplete
      multiple
      disablePortal
      filterSelectedOptions
      id="combo-box-demo"
      sx={{ flexGrow: "100" }}
      options={tags}
      getOptionLabel={(option: ITag) => {
        return option.name;
      }}
      onChange={(_, value) => props.set_selected_tags(value)}
      value={props.selected_tags}
      renderInput={(params) => <TextField label="Selected Tags" {...params} />}
      renderTags={(values, _: AutocompleteRenderGetTagProps) => {
        return (
          <div>
            {values.map((value) => (
              <TagSearcherChip tag={value} remove_tag={remove_tag_object} />
            ))}
          </div>
        );
      }}
    />
  );
};

export default TagSearcher;
