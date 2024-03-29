import { observer } from "mobx-react-lite";
import { useContext, useEffect, useState } from "react";
import SearchForm from "./search_form";
import SelectedVideosStore from "../../../store/selected_videos_store";
import VideoList from "../util/video_list";
import { useSearchParams } from "react-router-dom";
import PageSelector from "../../misc/page_selector";
import { Search } from "../../../api/agent";
import IVideoMeta from "../../../models/video_meta";

const SearchPage = () => {
  const PAGE_PARAM_KEY = "page";

  const selectedVideoStore = useContext(SelectedVideosStore);

  const [search_params, set_search_params] = useSearchParams({});
  const [current_page, set_current_page] = useState<number>(1);
  const [random_vid_url, set_random_vid_url] = useState<string>("");
  const [videos_count, set_videos_count] = useState<number>(0);

  const on_submit = async () => {
    const new_search_params = search_params;
    new_search_params.set(PAGE_PARAM_KEY, "1");
    set_search_params(new_search_params);
    set_current_page(1);
    await fetch_search_results();
    await fetch_random_video();
  };

  const fetch_search_results = async () => {
    let res = await Search.search_vidoes(search_params.toString());
    if (res.status !== 200) return;
    selectedVideoStore.set_adv_search_results(res.data.videos);
    set_videos_count(res.data.count);
    const search_params_page = search_params.get("page");
    if (!search_params_page) return;
    set_current_page(+search_params_page);
  };

  const fetch_random_video = async () => {
    const res = await Search.shuffle(search_params.toString());
    if (res.status !== 200) return;
    const random_video: IVideoMeta = res.data;
    set_random_vid_url(`/player/${random_video.id}`);
  };

  const handle_page_change = (page: number) => {
    set_current_page(page);
    const new_search_params = search_params;
    new_search_params.set(PAGE_PARAM_KEY, page.toString());
    set_search_params(new_search_params);
    fetch_search_results();
  };

  const calc_page_numbers = (): number => {
    if (videos_count === 0) return 0;
    const page_numbers = Math.floor(videos_count / 12);
    if (videos_count % 12 === 0) return page_numbers;
    return page_numbers + 1;
  };

  useEffect(() => {
    if (!search_params.toString()) return;
    fetch_search_results();
    fetch_random_video();
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <h1>Videos</h1>
      <SearchForm on_submit={on_submit} random_vid_url={random_vid_url} />
      {videos_count > 0 && <h4>{videos_count} results found.</h4>}
      <VideoList base="/player" videos={selectedVideoStore.adv_search_results} params={search_params.toString()} />
      {videos_count > 0 && <PageSelector pages={calc_page_numbers()} current_page={current_page} set_current_page={handle_page_change} />}
    </div>
  );
};

export default observer(SearchPage);
