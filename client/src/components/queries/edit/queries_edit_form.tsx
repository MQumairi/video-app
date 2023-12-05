import { observer } from "mobx-react-lite";
import { useContext, useEffect, useState } from "react";
import RatingSelector from "../../misc/rating_selector";
import TagSelector from "../../tags/util/selector/tag_selector";
import { Button, ButtonGroup, FormGroup, TextField } from "@mui/material";
import ResolutionSelector from "../../videos/search/resolution_selector";
import IPersistentQuery from "../../../models/persistent_query";
import TagsStore, { TagSelectorType } from "../../../store/tags_store";
import { PersistentQueries } from "../../../api/agent";
import IVideoMeta from "../../../models/video_meta";
import { VideoList } from "../../videos/util/video_list";

interface IProps {
  query_id: string;
}

const QueriesEditForm = (props: IProps) => {
  const tags_store = useContext(TagsStore);
  const [query, set_query] = useState<IPersistentQuery | null>(null);
  const [query_videos, set_query_videos] = useState<IVideoMeta[]>([]);

  const handle_preview = async () => {
    if (!query) return;
    const res = await PersistentQueries.preview_videos(query);
    if (res.status !== 200) return;
    set_query_videos(res.data.videos);
  };

  const handle_submit = async () => {
    if (!query) return;
    await PersistentQueries.edit(query);
  };

  const handle_name_change = (event: any) => {
    if (!query) return;
    const new_name = event.target.value;
    const new_query = { ...query };
    new_query.name = new_name;
    set_query(new_query);
  };

  const handle_search_text_change = (event: any) => {
    if (!query) return;
    const new_search_text = event.target.value;
    const new_query = { ...query };
    new_query.search_text = new_search_text;
    set_query(new_query);
  };

  const handle_min_rating_change = (event: any) => {
    if (!query) return;
    const new_min_rating = event.target.value;
    const new_query = { ...query };
    new_query.min_rating = new_min_rating;
    set_query(new_query);
  };

  const handle_max_rating_change = (event: any) => {
    if (!query) return;
    const new_max_rating = event.target.value;
    const new_query = { ...query };
    new_query.max_rating = new_max_rating;
    set_query(new_query);
  };

  const handle_resolution_change = (event: any) => {
    if (!query) return;
    const new_resolution = event.target.value;
    const new_query = { ...query };
    new_query.frame_height = new_resolution;
    set_query(new_query);
  };

  const handle_tag_changes = async (selector_type: TagSelectorType) => {
    if (!query) return;
    const selected_tags = tags_store.get_selected_tags(selector_type);
    const new_query = { ...query };
    if (selector_type === TagSelectorType.IncludedTags) new_query.included_tags = selected_tags;
    else if (selector_type === TagSelectorType.ExcludedTags) new_query.excluded_tags = selected_tags;
    set_query(new_query);
  };

  const fetch_query = async () => {
    if (!props.query_id || isNaN(+props.query_id)) return;
    const res = await PersistentQueries.details(+props.query_id);
    if (res.status !== 200) return;
    const new_query: IPersistentQuery = res.data;
    set_query(new_query);
    tags_store.set_selected_tags(TagSelectorType.IncludedTags, new_query.included_tags);
    tags_store.set_selected_tags(TagSelectorType.ExcludedTags, new_query.excluded_tags);
    const video_res = await PersistentQueries.preview_videos(res.data);
    if (video_res.status !== 200) return;
    set_query_videos(video_res.data.videos);
  };

  useEffect(() => {
    fetch_query();
    // eslint-disable-next-line
  }, []);

  if (!query) {
    return <div>Query Not Found</div>;
  }

  return (
    <div>
      <FormGroup sx={{ marginTop: "20px", gap: "15px" }}>
        <FormGroup row>
          <TextField sx={{ flexGrow: "100" }} variant="outlined" type="text" value={query.name} onChange={handle_name_change} label="Name" />
          <RatingSelector label={"Min"} rating={query.min_rating} handle_rating_change={handle_min_rating_change} />
          <RatingSelector label={"Max"} rating={query.max_rating} handle_rating_change={handle_max_rating_change} />
          <ResolutionSelector label={"Quality"} resolution={query.frame_height} handle_resolution_change={handle_resolution_change} />
        </FormGroup>
        <FormGroup>
          <TextField sx={{ flexGrow: "100" }} variant="outlined" type="text" value={query.search_text} onChange={handle_search_text_change} label="Search" />
        </FormGroup>
        <FormGroup row>
          <TagSelector
            selector_type={TagSelectorType.IncludedTags}
            post_deselection={() => handle_tag_changes(TagSelectorType.IncludedTags)}
            post_selection={() => handle_tag_changes(TagSelectorType.IncludedTags)}
          />
        </FormGroup>
        <FormGroup row>
          <TagSelector
            selector_type={TagSelectorType.ExcludedTags}
            post_deselection={() => handle_tag_changes(TagSelectorType.ExcludedTags)}
            post_selection={() => handle_tag_changes(TagSelectorType.ExcludedTags)}
          />
        </FormGroup>
        <ButtonGroup size="large" sx={{ margin: "10px 0px 10px 0px" }} variant="contained">
          <Button onClick={handle_preview}>Preview</Button>
          <Button onClick={handle_submit} disabled={query.name.length === 0}>
            Submit
          </Button>
        </ButtonGroup>
      </FormGroup>
      <VideoList videos={query_videos} base="/player" />
    </div>
  );
};

export default observer(QueriesEditForm);
