import { observer } from "mobx-react-lite";
import { useContext, useEffect, useState } from "react";
import { Tag } from "../../api/agent";
import ITag from "../../models/tag";
import AdvancedSearchForm from "./search_form";
import SelectedVideosStore from "../../store/selected_videos_store";
import Advanced_search_results from "./search_results";
import BrowserResults from "../browser/browser_results";

const AdvancedSearchPage = () => {
  const selectedVideoStore = useContext(SelectedVideosStore);

  const [tags, set_tags] = useState<ITag[]>([]);

  const fetch_tags = async () => {
    let received_tags = (await Tag.get()).data;
    set_tags(received_tags);
  };

  useEffect(() => {
    fetch_tags();
  }, []);
  return (
    <div>
      <h1>Search</h1>
      {tags.length > 0 && <AdvancedSearchForm tags={tags} />}
      <BrowserResults back_url={"/advanced-search"} directories={[]} videos={selectedVideoStore.adv_search_results} />
    </div>
  );
};

export default observer(AdvancedSearchPage);
