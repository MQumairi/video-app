import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Search, Tag } from "../../../api/agent";
import ITag from "../../../models/tag";
import IVideoMeta from "../../../models/video_meta";
import { PathConverter } from "../../../util/path_converter";
import VideoTags from "../../player/video_tags";
import VideoList from "../../videos/video_list";
import { Button, ButtonGroup } from "@mui/material";
import PageSelector from "../../search/page_selector";

const TagDetailsPage = () => {
  let tag_id = useParams().tag_id ?? 1;
  const [tag, set_tag] = useState<ITag | null>(null);
  const [random_vid, set_random_vid] = useState<IVideoMeta | null>(null);

  const [search_params, set_search_params] = useSearchParams({});
  const [videos_count, set_videos_count] = useState<number>(0);
  const [current_page, set_current_page] = useState<number>(1);

  const fetch_tag = async () => {
    const res = await Tag.details(+tag_id, search_params.toString());
    if (res.status != 200) return;
    set_tag(res.data.tag);
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
    if (videos_count == 0) return 0;
    const page_numbers = Math.floor(videos_count / 12);
    console.log("page numbers are", page_numbers);
    if (videos_count % 12 === 0) return page_numbers;
    console.log("adding 1....");
    return page_numbers + 1;
  };

  useEffect(() => {
    fetch_tag();
    fetch_random_tag_video();
  }, []);

  if (!tag) return <h2>Loading Tag...</h2>;

  return (
    <div>
      <h1>{tag.name}</h1>
      <ButtonGroup sx={{ margin: "10px 0px 10px 0px" }} variant="contained" size="large">
        <Button href="/tags">Back</Button>
        {random_vid && <Button href={`/tags/${tag_id}/video/${PathConverter.to_query(random_vid.path)}`}>Random</Button>}
        <Button href={`/tags/${tag_id}/edit`}>Edit</Button>
        <Button href={`/tags/${tag_id}/delete`}>Delete</Button>
      </ButtonGroup>
      {tag.child_tags && tag.child_tags.length > 0 && <VideoTags tags={tag.child_tags} />}
      <VideoList base={`/tags/${tag.id}/video`} videos={tag.videos} />
      {videos_count > 0 && <PageSelector pages={calc_page_numbers()} current_page={current_page} set_current_page={handle_page_change} />}
    </div>
  );
};

export default observer(TagDetailsPage);
