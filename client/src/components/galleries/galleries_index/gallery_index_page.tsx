import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import ITag from "../../../models/tag";
import { Search } from "../../../api/agent";
import TagSearcher from "../../tags/tag_popover/tag_searcher";
import IImageGallery from "../../../models/image_gallery";
import { Button } from "@mui/material";
import GalleryList from "./gallery_list";
import { useSearchParams } from "react-router-dom";
import PageSelector from "../../search/page_selector";

const GalleryIndexPage = () => {
  const PAGE_PARAM_KEY = "page";

  const [selected_tags, set_selected_tags] = useState<ITag[]>([]);
  const [galleries, set_galleries] = useState<IImageGallery[]>([]);
  const [search_params, set_search_params] = useSearchParams({});
  const [current_page, set_current_page] = useState<number>(1);
  const [galleries_count, set_galleries_count] = useState<number>(0);

  const handle_submit = async () => {
    await fetch_search_results();
  };

  const handle_tags_change = (tags: ITag[]) => {
    set_selected_tags(tags);
    const tag_ids = tags.map((t) => {
      return t.id;
    });
    const new_search_params = search_params;
    new_search_params.set("tags", tag_ids.join("-"));
    set_search_params(new_search_params);
  };

  const fetch_search_results = async () => {
    let res = await Search.search_galleries(search_params.toString());
    console.log("returned res");
    if (res.status != 200) return;
    console.log("res data:", res.data);
    set_galleries_count(res.data.count);
    set_galleries(res.data.galleries);
  };

  useEffect(() => {
    if (!search_params.toString()) return;
    fetch_search_results();
  }, []);

  const handle_page_change = (page: number) => {
    set_current_page(page);
    const new_search_params = search_params;
    new_search_params.set(PAGE_PARAM_KEY, page.toString());
    set_search_params(new_search_params);
    fetch_search_results();
  };

  const calc_page_numbers = (): number => {
    if (galleries_count == 0) return 0;
    const page_numbers = Math.floor(galleries_count / 12);
    if (galleries_count % 12 === 0) return page_numbers;
    return page_numbers + 1;
  };

  return (
    <div>
      <h1>Galleries</h1>
      <TagSearcher selected_tags={selected_tags} set_selected_tags={handle_tags_change} />
      <Button style={{ margin: "10px 0px 10px 0px" }} variant="contained" size="large" onClick={handle_submit}>
        Submit
      </Button>
      <GalleryList galleries={galleries} />
      {galleries_count > 0 && <PageSelector pages={calc_page_numbers()} current_page={current_page} set_current_page={handle_page_change} />}
    </div>
  );
};

export default observer(GalleryIndexPage);
