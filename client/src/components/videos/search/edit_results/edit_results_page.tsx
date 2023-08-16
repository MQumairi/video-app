import { observer } from "mobx-react-lite";
import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "../../../../api/agent";
import { Button } from "@mui/material";
import TagsStore, { TagSelectorType } from "../../../../store/tags_store";
import TagSelector from "../../../tags/util/selector/tag_selector";

const EditResultsPage = () => {
  const tags_store = useContext(TagsStore);

  const [search_params, set_search_params] = useSearchParams({});
  const [videos_count, set_videos_count] = useState<number>(0);

  const TAGS_EXCLUDED_PARAM_KEY = "excluded_tags";
  const TAGS_PARAM_KEY = "tags";

  const update_query_params = (key: string, value: string) => {
    const new_search_params = search_params;
    new_search_params.set(key, value);
    set_search_params(new_search_params);
  };

  const selector_param = (selector_type: TagSelectorType): string => {
    if (selector_type === TagSelectorType.ExcludedTags) return TAGS_EXCLUDED_PARAM_KEY;
    return TAGS_PARAM_KEY;
  };

  const handle_tags_addition = (selector_type: TagSelectorType) => {
    update_query_params(selector_param(selector_type), tags_store.selected_tags_query_parms(selector_type));
  };

  const handle_tag_removal = (selector_type: TagSelectorType) => {
    update_query_params(selector_param(selector_type), tags_store.selected_tags_query_parms(selector_type));
  };

  const on_submit = async () => {
    await Search.tag_results(search_params.toString());
  };

  const fetch_search_results = async () => {
    let res = await Search.search_vidoes(search_params.toString());
    if (res.status !== 200) return;
    set_videos_count(res.data.count);
  };

  useEffect(() => {
    if (!search_params.toString()) return;
    fetch_search_results();
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <Button size="large" variant="contained" href={`/search?${search_params}`}>
        Back
      </Button>
      <h1>Edit Results Page</h1>
      <h2>{videos_count} videos</h2>
      <div>
        <p style={{ marginBottom: "20px" }}>Adds Tags:</p>
        <TagSelector
          selector_type={TagSelectorType.IncludedTags}
          post_selection={() => handle_tags_addition(TagSelectorType.IncludedTags)}
          post_deselection={() => handle_tag_removal(TagSelectorType.IncludedTags)}
        />
      </div>
      <div>
        <p style={{ marginBottom: "20px" }}>Remove Tags:</p>
        <TagSelector
          selector_type={TagSelectorType.ExcludedTags}
          post_selection={() => handle_tags_addition(TagSelectorType.ExcludedTags)}
          post_deselection={() => handle_tag_removal(TagSelectorType.ExcludedTags)}
        />
      </div>
      <Button size="large" variant="contained" onClick={on_submit}>
        Submit
      </Button>
    </div>
  );
};

export default observer(EditResultsPage);
