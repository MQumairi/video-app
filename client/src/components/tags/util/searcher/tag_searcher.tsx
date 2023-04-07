import Autocomplete, { AutocompleteRenderGetTagProps } from "@mui/material/Autocomplete";
import ITag from "../../../../models/tag";
import { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import TagSearcherChip from "./tag_searcher_chip";
import { Tag } from "../../../../api/agent";
import { useSearchParams } from "react-router-dom";

interface IProps {
  selected_tags: ITag[];
  set_selected_tags: (tags: ITag[]) => void;
}

const TagSearcher: React.FC<IProps> = (props: IProps) => {
  const [tags, set_tags] = useState<ITag[]>([]);
  const [search_params] = useSearchParams({});

  const remove_tag_object = (tag: ITag) => {
    const new_tags: ITag[] = [];
    for (let i = 0; i < props.selected_tags.length; i++) {
      const t = props.selected_tags[i];
      if (t.id !== tag.id) {
        new_tags.push(t);
      }
    }
    props.set_selected_tags(new_tags);
  };

  const fetch_tags = async () => {
    console.log("fetching tags for tag_searcher");
    let res = await Tag.get();
    if (res.status !== 200) return;
    console.log("received 200 response");
    const fetched_tags: ITag[] = res.data;
    set_tags(fetched_tags);
    const selected_tag_ids = search_params.get("tags");
    if (selected_tag_ids) {
      const tags = tag_params_to_tags(fetched_tags, selected_tag_ids);
      props.set_selected_tags(tags);
    }
  };

  const tag_params_to_tags = (tags: ITag[], tags_params: string): ITag[] => {
    const tag_ids = new Set(
      tags_params.split("-").map((t) => {
        return +t;
      })
    );
    const tags_from_params: ITag[] = [];
    for (const t of tags) {
      if (tag_ids.has(t.id)) tags_from_params.push(t);
    }
    return tags_from_params;
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
