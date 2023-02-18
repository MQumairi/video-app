import { observer } from "mobx-react-lite";
import ITag from "../../models/tag";
import { useEffect, useState } from "react";
import RatingSelector from "./rating_selector";
import TagSearcher from "../tags/tag_popover/tag_searcher";
import Resolution_selector from "./resolution_selector";
import { useSearchParams } from "react-router-dom";
import { Button, ButtonGroup, FormGroup } from "@mui/material";

interface IProps {
  on_submit: () => void;
  random_vid_url: string;
}

const SearchForm = (props: IProps) => {
  const [selected_tags, set_selected_tags] = useState<ITag[]>([]);
  const [min_rating, set_min_rating] = useState<number>(0);
  const [max_rating, set_max_rating] = useState<number>(10);
  const [min_resolution, set_min_resolution] = useState<number>(0);
  const [search_params, set_search_params] = useSearchParams({});

  const TAGS_PARAM_KEY = "tags";
  const MIN_RATING_PARAM_KEY = "minrate";
  const MAX_RATING_PARAM_KEY = "maxrate";
  const RES_PARAM_KEY = "resolution";

  const handle_tags_change = (tags: ITag[]) => {
    set_selected_tags(tags);
    const tag_ids = tags.map((t) => {
      return t.id;
    });
    const new_search_params = search_params;
    new_search_params.set(TAGS_PARAM_KEY, tag_ids.join("-"));
    set_search_params(new_search_params);
  };

  const handle_min_rating_change = async (event: any) => {
    const new_rating = event.target.value;
    set_min_rating(new_rating);
    const new_search_params = search_params;
    new_search_params.set(MIN_RATING_PARAM_KEY, new_rating.toString());
    set_search_params(new_search_params);
  };

  const handle_max_rating_change = async (event: any) => {
    const new_rating = event.target.value;
    set_max_rating(new_rating);
    const new_search_params = search_params;
    new_search_params.set(MAX_RATING_PARAM_KEY, new_rating.toString());
    set_search_params(new_search_params);
  };

  const handle_resolution_change = async (event: any) => {
    const new_resolution = event.target.value;
    set_min_resolution(new_resolution);
    const new_search_params = search_params;
    new_search_params.set(RES_PARAM_KEY, new_resolution.toString());
    set_search_params(new_search_params);
  };

  useEffect(() => {
    const min_rating = search_params.get(MIN_RATING_PARAM_KEY);
    const max_rating = search_params.get(MAX_RATING_PARAM_KEY);
    const resolution = search_params.get(RES_PARAM_KEY);
    if (min_rating) set_min_rating(+min_rating);
    if (max_rating) set_max_rating(+max_rating);
    if (resolution) set_min_resolution(+resolution);
  }, []);

  return (
    <div>
      <FormGroup row sx={{ width: "100%" }}>
        <TagSearcher selected_tags={selected_tags} set_selected_tags={handle_tags_change} />
        <RatingSelector label={"Min"} rating={min_rating} handle_rating_change={handle_min_rating_change} />
        <RatingSelector label={"Max"} rating={max_rating} handle_rating_change={handle_max_rating_change} />
        <Resolution_selector label={"Quality"} resolution={min_resolution} handle_resolution_change={handle_resolution_change} />
      </FormGroup>
      <ButtonGroup size="large" sx={{ margin: "10px 0px 10px 0px" }} variant="contained">
        <Button onClick={props.on_submit}>Submit</Button>
        {props.random_vid_url != "" && <Button href={`${props.random_vid_url}?${search_params}`}>Random</Button>}
      </ButtonGroup>
    </div>
  );
};

export default observer(SearchForm);
