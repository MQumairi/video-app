import { observer } from "mobx-react-lite";
import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "../../../../api/agent";
import { Button } from "@mui/material";
import TagsStore from "../../../../store/tags_store";
import TagSearcher from "../../../tags/util/searcher/tag_searcher";

const EditResultsPage = () => {
  const tags_store = useContext(TagsStore);

  const [search_params] = useSearchParams({});
  const [videos_count, set_videos_count] = useState<number>(0);

  const on_submit = async () => {
    const tags = tags_store.get_selected_tags();
    console.log("submiting", tags);
    await Search.tag_results(search_params.toString(), tags);
  };

  const fetch_search_results = async () => {
    let res = await Search.search_vidoes(search_params.toString());
    if (res.status !== 200) return;
    set_videos_count(res.data.count);
  };

  const handle_tags_addition = () => {
    console.log("added tag, selected_tags:", tags_store.included_tags);
  };

  const handle_tag_removal = () => {
    console.log("added tag, selected_tags:", tags_store.included_tags);
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
      <p style={{ marginBottom: "20px" }}>You're about to tag {videos_count} videos. Are you sure you wish to continue?</p>
      <TagSearcher post_selection={handle_tags_addition} post_deselection={handle_tag_removal} />
      <Button size="large" variant="contained" onClick={on_submit}>
        Submit
      </Button>
    </div>
  );
};

export default observer(EditResultsPage);
