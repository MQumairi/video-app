import { observer } from "mobx-react-lite";
import { useContext, useState } from "react";
import RatingSelector from "../../misc/rating_selector";
import TagSearcher from "../../tags/util/searcher/tag_searcher";
import { Button, ButtonGroup, FormGroup, TextField } from "@mui/material";
import ResolutionSelector from "../../videos/search/resolution_selector";
import IPersistentQuery, { IPersistentQueryCreate } from "../../../models/persistent_query";
import TagsStore from "../../../store/tags_store";
import { PersistentQueries } from "../../../api/agent";
import IVideoMeta from "../../../models/video_meta";
import { VideoList } from "../../videos/util/video_list";

const QueriesCreateForm = () => {
  const [name, set_name] = useState<string>("");
  const [searched_text, set_searched_text] = useState<string>("");
  const [min_rating, set_min_rating] = useState<number>(0);
  const [max_rating, set_max_rating] = useState<number>(10);
  const [min_resolution, set_min_resolution] = useState<number>(0);
  const [query_videos, set_query_videos] = useState<IVideoMeta[]>([]);

  const tags_store = useContext(TagsStore);

  const handle_preview = async () => {
    const persistent_query: IPersistentQuery = {
      id: 1,
      name: name,
      search_text: searched_text,
      included_tags: tags_store.included_tags,
      excluded_tags: [],
      min_rating: min_rating,
      max_rating: max_rating,
      frame_height: min_resolution,
      min_duration_sec: 0,
      max_duration_sec: 99999999,
    };
    const res = await PersistentQueries.preview_videos(persistent_query);
    if (res.status !== 200) return;
    set_query_videos(res.data.videos);
  };

  const handle_submit = async () => {
    const persistent_query: IPersistentQueryCreate = {
      name: name,
      search_text: searched_text,
      included_tags: tags_store.included_tags,
      excluded_tags: [],
      min_rating: min_rating,
      max_rating: max_rating,
      frame_height: min_resolution,
      min_duration_sec: 0,
      max_duration_sec: 99999999,
    };
    await PersistentQueries.create(persistent_query);
  };

  const handle_name_change = (event: any) => {
    const new_name = event.target.value;
    set_name(new_name);
  };

  const handle_search_text_change = (event: any) => {
    const new_search_text = event.target.value;
    set_searched_text(new_search_text);
  };

  const handle_min_rating_change = (event: any) => {
    const new_rating = event.target.value;
    set_min_rating(new_rating);
  };

  const handle_max_rating_change = (event: any) => {
    const new_rating = event.target.value;
    set_max_rating(new_rating);
  };

  const handle_resolution_change = (event: any) => {
    const new_resolution = event.target.value;
    set_min_resolution(new_resolution);
  };

  return (
    <div>
      <FormGroup sx={{ marginTop: "20px", gap: "15px" }}>
        <FormGroup row>
          <TextField sx={{ flexGrow: "100" }} variant="outlined" type="text" value={name} onChange={handle_name_change} label="Name" />
          <RatingSelector label={"Min"} rating={min_rating} handle_rating_change={handle_min_rating_change} />
          <RatingSelector label={"Max"} rating={max_rating} handle_rating_change={handle_max_rating_change} />
          <ResolutionSelector label={"Quality"} resolution={min_resolution} handle_resolution_change={handle_resolution_change} />
        </FormGroup>
        <FormGroup>
          <TextField sx={{ flexGrow: "100" }} variant="outlined" type="text" value={searched_text} onChange={handle_search_text_change} label="Search" />
        </FormGroup>
        <FormGroup row>
          <TagSearcher post_selection={() => {}} post_deselection={() => {}} />
        </FormGroup>
        <ButtonGroup size="large" sx={{ margin: "10px 0px 10px 0px" }} variant="contained">
          <Button onClick={handle_preview}>Preview</Button>
          <Button onClick={handle_submit} disabled={name.length === 0}>
            Create
          </Button>
        </ButtonGroup>
      </FormGroup>
      <VideoList videos={query_videos} base="/player" />
    </div>
  );
};

export default observer(QueriesCreateForm);
