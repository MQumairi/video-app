import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Search, Tag } from "../../../api/agent";
import ITag from "../../../models/tag";
import IVideoMeta from "../../../models/video_meta";
import { PathConverter } from "../../../util/path_converter";
import VideoTags from "../../player/video_tags";
import { Button, ButtonGroup } from "@mui/material";
import { LocalOffer, MovieCreation, Person, Subscriptions } from "@mui/icons-material";
import { TagType, get_tag_type } from "../../../lib/tag_util";
import TagDetailsTabs from "./tag_details_tabs";

const TagDetailsPage = () => {
  let tag_id = useParams().tag_id ?? 1;
  const [tag, set_tag] = useState<ITag | null>(null);
  const [random_vid, set_random_vid] = useState<IVideoMeta | null>(null);
  const [tag_type, set_tag_type] = useState<TagType>(TagType.Default);

  const [search_params, set_search_params] = useSearchParams({});
  const [videos_count, set_videos_count] = useState<number>(0);
  const [current_page, set_current_page] = useState<number>(1);

  const fetch_tag = async () => {
    const res = await Tag.details(+tag_id, search_params.toString());
    if (res.status !== 200) return;
    const fetched_tag = res.data.tag;
    set_tag(fetched_tag);
    set_tag_type(get_tag_type(fetched_tag));
    set_videos_count(res.data.count);
  };

  const fetch_random_tag_video = async () => {
    let res = await Search.shuffle(`tags=${tag_id}`);
    set_random_vid(res);
  };

  const handle_page_change = (page: number) => {
    set_current_page(page);
    const new_search_params = search_params;
    new_search_params.set("page", page.toString());
    set_search_params(new_search_params);
    fetch_tag();
  };

  const calc_page_numbers = (): number => {
    if (videos_count === 0) return 0;
    const page_numbers = Math.floor(videos_count / 12);
    console.log("page numbers are", page_numbers);
    if (videos_count % 12 === 0) return page_numbers;
    console.log("adding 1....");
    return page_numbers + 1;
  };

  useEffect(() => {
    fetch_tag();
    fetch_random_tag_video();
    // eslint-disable-next-line
  }, []);

  if (!tag) return <h2>Loading Tag...</h2>;

  return (
    <div>
      <div style={{ display: "flex", gap: "10px" }}>
        {tag_type === TagType.Default && <LocalOffer fontSize="large" />}
        {tag_type === TagType.Character && <Person fontSize="large" />}
        {tag_type === TagType.Studio && <MovieCreation fontSize="large" />}
        {tag_type === TagType.Playlist && <Subscriptions fontSize="large" />}
        <h2>{tag.name}</h2>
      </div>
      <ButtonGroup sx={{ margin: "10px 0px 10px 0px" }} variant="contained" size="large">
        <Button href={`/tags?${search_params.toString()}`}>Back</Button>
        {random_vid && <Button href={`/tags/${tag_id}/video/${PathConverter.to_query(random_vid.path)}`}>Random</Button>}
        <Button href={`/tags/${tag_id}/edit`}>Edit</Button>
        <Button href={`/tags/${tag_id}/delete`}>Delete</Button>
      </ButtonGroup>
      {tag.child_tags && tag.child_tags.length > 0 && <VideoTags tags={tag.child_tags} />}
      <TagDetailsTabs tag={tag} pages_total={calc_page_numbers()} current_page={current_page} handle_page_change={handle_page_change} />
    </div>
  );
};

export default observer(TagDetailsPage);
