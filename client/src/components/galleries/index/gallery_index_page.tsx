import { observer } from "mobx-react-lite";
import { useContext, useEffect, useState } from "react";
import { Search } from "../../../api/agent";
import TagSearcher from "../../tags/util/searcher/tag_searcher";
import IImageGallery from "../../../models/image_gallery";
import { Button } from "@mui/material";
import GalleryList from "./gallery_list";
import { useSearchParams } from "react-router-dom";
import PageSelector from "../../search/page_selector";
import TagsStore from "../../../store/tags_store";

const GalleryIndexPage = () => {
  const tags_store = useContext(TagsStore);

  const [galleries, set_galleries] = useState<IImageGallery[]>([]);
  const [search_params, set_search_params] = useSearchParams({});
  const [current_page, set_current_page] = useState<number>(1);
  const [galleries_count, set_galleries_count] = useState<number>(0);

  const PAGE_PARAM_KEY = "page";
  const TAGS_PARAM_KEY = "tags";

  const handle_submit = async () => {
    await fetch_search_results();
  };

  const fetch_search_results = async () => {
    let res = await Search.search_galleries(search_params.toString());
    console.log("returned res");
    if (res.status !== 200) return;
    console.log("res data:", res.data);
    set_galleries_count(res.data.count);
    set_galleries(res.data.galleries);
  };

  const handle_page_change = (page: number) => {
    set_current_page(page);
    update_query_params(PAGE_PARAM_KEY, page.toString());
    fetch_search_results();
  };

  const calc_page_numbers = (): number => {
    if (galleries_count === 0) return 0;
    const page_numbers = Math.floor(galleries_count / 12);
    if (galleries_count % 12 === 0) return page_numbers;
    return page_numbers + 1;
  };

  const update_query_params = (key: string, value: string) => {
    const new_search_params = search_params;
    new_search_params.set(key, value);
    set_search_params(new_search_params);
  };

  const handle_tags_addition = () => {
    update_query_params(TAGS_PARAM_KEY, tags_store.selected_tags_query_parms());
  };

  const handle_tag_removal = () => {
    update_query_params(TAGS_PARAM_KEY, tags_store.selected_tags_query_parms());
  };

  useEffect(() => {
    if (!search_params.toString()) return;
    fetch_search_results();
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <h1>Galleries</h1>
      <TagSearcher post_selection={handle_tags_addition} post_deselection={handle_tag_removal} />
      <Button style={{ margin: "10px 0px 10px 0px" }} variant="contained" size="large" onClick={handle_submit}>
        Submit
      </Button>
      <GalleryList galleries={galleries} />
      {galleries_count > 0 && <PageSelector pages={calc_page_numbers()} current_page={current_page} set_current_page={handle_page_change} />}
    </div>
  );
};

export default observer(GalleryIndexPage);
