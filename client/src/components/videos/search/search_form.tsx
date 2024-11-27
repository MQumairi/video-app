import { observer } from "mobx-react-lite";
import { useContext, useEffect, useState } from "react";
import RatingSelector from "../../misc/rating_selector";
import TagSelector from "../../tags/util/selector/tag_selector";
import ResolutionSelector from "./resolution_selector";
import { useSearchParams } from "react-router-dom";
import { Button, ButtonGroup, FormGroup, TextField } from "@mui/material";
import TagsStore, { TagSelectorType } from "../../../store/tags_store";
import SortSelector from "./sort_selector";
import { Tag } from "../../../api/agent";

interface IProps {
  on_submit: () => void;
  random_vid_url: string;
}

const SearchForm = (props: IProps) => {
  const tags_store = useContext(TagsStore);

  const [searched_text, set_searched_text] = useState<string>("");
  const [min_rating, set_min_rating] = useState<number>(0);
  const [max_rating, set_max_rating] = useState<number>(10);
  const [min_resolution, set_min_resolution] = useState<number>(0);
  const [search_params, set_search_params] = useSearchParams({});
  const [sort_option, set_sort_option] = useState<string>("Path");

  const TEXT_PARAM_KEY = "searched_text";
  const TAGS_PARAM_KEY = "tags";
  const TAGS_EXCLUDED_PARAM_KEY = "excluded_tags";
  const MIN_RATING_PARAM_KEY = "minrate";
  const MAX_RATING_PARAM_KEY = "maxrate";
  const RES_PARAM_KEY = "resolution";
  const SORT_PARAM_KEY = "sort";

  const update_query_params = (key: string, value: string) => {
    const new_search_params = search_params;
    new_search_params.set(key, value);
    set_search_params(new_search_params);
  };

  const selector_param = (selector_type: TagSelectorType): string => {
    if (selector_type === TagSelectorType.ExcludedTags) return TAGS_EXCLUDED_PARAM_KEY;
    return TAGS_PARAM_KEY;
  };

  const set_excluded_tags = async () => {
    console.log("calling set_excluded_tags")
    const res = await Tag.excluded();
    if (res.status !== 200) return;
    let excluded_tags = res.data;
    console.log("excluded tags are: ", excluded_tags);
    tags_store.set_selected_tags(TagSelectorType.ExcludedTags, excluded_tags);
    update_query_params(TAGS_EXCLUDED_PARAM_KEY, tags_store.selected_tags_query_parms(TagSelectorType.ExcludedTags));
  };

  const handle_tags_addition = (selector_type: TagSelectorType) => {
    update_query_params(selector_param(selector_type), tags_store.selected_tags_query_parms(selector_type));
  };

  const handle_tag_removal = (selector_type: TagSelectorType) => {
    update_query_params(selector_param(selector_type), tags_store.selected_tags_query_parms(selector_type));
  };

  const handle_search_text_change = async (event: any) => {
    const new_search_text = event.target.value;
    set_searched_text(new_search_text);
    update_query_params(TEXT_PARAM_KEY, new_search_text);
  };

  const handle_min_rating_change = async (event: any) => {
    const new_rating = event.target.value;
    set_min_rating(new_rating);
    update_query_params(MIN_RATING_PARAM_KEY, new_rating.toString());
  };

  const handle_max_rating_change = async (event: any) => {
    const new_rating = event.target.value;
    set_max_rating(new_rating);
    update_query_params(MAX_RATING_PARAM_KEY, new_rating.toString());
  };

  const handle_resolution_change = async (event: any) => {
    const new_resolution = event.target.value;
    set_min_resolution(new_resolution);
    update_query_params(RES_PARAM_KEY, new_resolution.toString());
  };

  const handle_sort_change = async (event: any) => {
    const new_sort_option = event.target.value;
    set_sort_option(new_sort_option);
    update_query_params(SORT_PARAM_KEY, new_sort_option);
  };

  const lookup_and_set_query = async () => {
    console.log("calling lookup from seach form");
    await tags_store.lookup();
    const selected_tag_ids = search_params.get(TAGS_PARAM_KEY);
    if (selected_tag_ids) {
      const tags = tags_store.search_query_to_tags(selected_tag_ids);
      tags_store.set_selected_tags(TagSelectorType.IncludedTags, tags);
    }
    const excluded_tag_ids = search_params.get(TAGS_EXCLUDED_PARAM_KEY);
    if (excluded_tag_ids) {
      const excluded_tags = tags_store.search_query_to_tags(excluded_tag_ids);
      tags_store.set_selected_tags(TagSelectorType.ExcludedTags, excluded_tags);
    }
  };

  useEffect(() => {
    const search_text = search_params.get(TEXT_PARAM_KEY);
    const min_rating = search_params.get(MIN_RATING_PARAM_KEY);
    const max_rating = search_params.get(MAX_RATING_PARAM_KEY);
    const resolution = search_params.get(RES_PARAM_KEY);
    const tags_params = search_params.get(TAGS_PARAM_KEY);
    const tags_excluded_params = search_params.get(TAGS_EXCLUDED_PARAM_KEY);
    const sort_option_param = search_params.get(SORT_PARAM_KEY);
    set_excluded_tags()
    if (search_text) set_searched_text(search_text);
    if (min_rating) set_min_rating(+min_rating);
    if (max_rating) set_max_rating(+max_rating);
    if (resolution) set_min_resolution(+resolution);
    if (sort_option_param) set_sort_option(sort_option_param);
    if (!tags_params && !tags_excluded_params) return;
    lookup_and_set_query();
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <FormGroup sx={{ gap: "15px" }}>
        <FormGroup row>
          <TextField sx={{ flexGrow: "100" }} variant="outlined" type="text" value={searched_text} onChange={handle_search_text_change} label="Search" />
          <RatingSelector label={"Min"} rating={min_rating} handle_rating_change={handle_min_rating_change} />
          <RatingSelector label={"Max"} rating={max_rating} handle_rating_change={handle_max_rating_change} />
          <ResolutionSelector label={"Quality"} resolution={min_resolution} handle_resolution_change={handle_resolution_change} />
          <SortSelector selected_sort_option={sort_option} handle_sort_change={handle_sort_change} />
        </FormGroup>
        <FormGroup row>
          <TagSelector
            selector_type={TagSelectorType.IncludedTags}
            post_selection={() => handle_tags_addition(TagSelectorType.IncludedTags)}
            post_deselection={() => handle_tag_removal(TagSelectorType.IncludedTags)}
          />
        </FormGroup>
        <FormGroup row>
          <TagSelector
            selector_type={TagSelectorType.ExcludedTags}
            post_selection={() => handle_tags_addition(TagSelectorType.ExcludedTags)}
            post_deselection={() => handle_tag_removal(TagSelectorType.ExcludedTags)}
          />
        </FormGroup>
      </FormGroup>
      <ButtonGroup size="large" sx={{ margin: "10px 0px 10px 0px" }} variant="contained">
        <Button onClick={props.on_submit}>Submit</Button>
        {props.random_vid_url !== "" && <Button href={`${props.random_vid_url}?${search_params}`}>Random</Button>}
        <Button href={`/search-results-edit?${search_params}`}>Edit</Button>
      </ButtonGroup>
    </div>
  );
};

export default observer(SearchForm);
