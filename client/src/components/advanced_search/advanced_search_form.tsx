import { observer } from "mobx-react-lite";
import HrefButton from "../misc/href_button";
import FunctionButton from "../misc/function_button";
import { Autocomplete, MenuItem, Select, TextField } from "@mui/material";
import AutoCompleteHook from "../misc/auto_complete_input";
import ITag from "../../models/tag";
import { useContext, useState } from "react";
import SelectedVideosStore from "../../store/selected_videos_store";
import IAdvancedSearchQuery from "../../models/advanced_search_query";
import { Directory } from "../../api/agent";
import { PathConverter } from "../../util/path_converter";
import RatingSelector from "./rating_selector";

interface IProps {
  tags: ITag[];
}

const AdvancedSearchForm = (props: IProps) => {
  const selectedVideoStore = useContext(SelectedVideosStore);
  const [random_vid_url, set_random_vid_url] = useState<string>("");
  const [min_rating, set_min_rating] = useState<number>(0);
  const [max_rating, set_max_rating] = useState<number>(5);

  const on_submit = async (input: any) => {
    const selected_tags = selectedVideoStore.searched_for_tags;
    const query: IAdvancedSearchQuery = {
      included_tags: selected_tags,
      min_rating: min_rating,
      max_rating: max_rating,
    };
    const res = await Directory.adv_search(query);
    selectedVideoStore.set_adv_search_results(res);
    await fetch_random_video();
  };

  const fetch_random_video = async () => {
    let response = await Directory.adv_search_shuffle();
    set_random_vid_url(`/player/${PathConverter.to_query(response.path)}`);
  };

  const handle_min_rating_change = async (event: any) => {
    const new_rating = event.target.value;
    console.log("new rating:", new_rating);
    set_min_rating(new_rating);
  };

  const handle_max_rating_change = async (event: any) => {
    const new_rating = event.target.value;
    console.log("new rating:", new_rating);
    set_max_rating(new_rating);
  };

  return (
    <form onSubmit={on_submit}>
      <div style={{ display: "flex" }}>
        <div>
          <label>Selected Tags:</label>
          <AutoCompleteHook options={props.tags} />
        </div>
        <RatingSelector label={"Min"} rating={min_rating} handle_rating_change={handle_min_rating_change} />
        <RatingSelector label={"Max"} rating={max_rating} handle_rating_change={handle_max_rating_change} />
      </div>
      <h4>{selectedVideoStore.adv_search_results.length} results found.</h4>
      <FunctionButton textContent="Submit" fn={on_submit} />
      {random_vid_url != "" && <HrefButton textContent="Random" href={random_vid_url} />}
    </form>
  );
};

export default observer(AdvancedSearchForm);
