import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Tag } from "../../../api/agent";
import ITag from "../../../models/tag";
import IVideoMeta from "../../../models/video_meta";
import VideoTags from "../../videos/player/tags/video_tags";
import { Button, ButtonGroup, Chip, Stack } from "@mui/material";
import { Code, Dvr, LocalOffer, MovieCreation, Person, Subscriptions } from "@mui/icons-material";
import { TagType, get_tag_type } from "../../../lib/tag_util";
import TagDetailsTabs from "./tag_details_tabs";
import IPersistentQuery from "../../../models/persistent_query";
import DynamicPlaylisyQueries from "../dynamic_playlist/dynamic_playlisy_queries";

const TagDetailsPage = () => {
  let tag_id = useParams().tag_id ?? 1;
  const [tag, set_tag] = useState<ITag | null>(null);
  const [playlist_queries, set_playlist_queries] = useState<IPersistentQuery[]>([]);
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
    set_playlist_queries(res.data.queries);
  };

  const fetch_random_tag_video = async () => {
    let res = await Tag.shuffle(+tag_id);
    if (res.status !== 200) return;
    set_random_vid(res.data);
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
    if (videos_count % 12 === 0) return page_numbers;
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
      <Stack direction="row" spacing={1}>
        {tag_type === TagType.Default && <LocalOffer fontSize="large" />}
        {tag_type === TagType.Character && <Person fontSize="large" />}
        {tag_type === TagType.Studio && <MovieCreation fontSize="large" />}
        {tag_type === TagType.Playlist && <Subscriptions fontSize="large" />}
        {tag_type === TagType.Script && <Code fontSize="large" />}
        {tag_type === TagType.Series && <Dvr fontSize="large" />}
        <h2>{tag.name}</h2>
      </Stack>
      <Stack direction="row" spacing={1}>
        <Chip size="small" variant="outlined" label={tag.id} color="primary" />
        {tag.default_excluded && <Chip size="small" variant="outlined" label={"Default Excluded"} color="primary" />}
      </Stack>
      <ButtonGroup sx={{ margin: "10px 0px 10px 0px" }} variant="contained" size="large">
        <Button href={`/tags?${search_params.toString()}`}>Back</Button>
        {random_vid && <Button href={`/tags/${tag_id}/video/${random_vid.id}`}>Random</Button>}
        {tag.is_dynamic_playlist && <Button href={`/dynamic-playlist/${tag_id}/order/${1}`}>Play</Button>}
        <Button href={`/tags/${tag_id}/edit`}>Edit</Button>
        <Button href={`/tags/${tag_id}/delete`}>Delete</Button>
      </ButtonGroup>
      {tag.child_tags && tag.child_tags.length > 0 && <VideoTags tags={tag.child_tags} />}
      {tag.is_dynamic_playlist && <DynamicPlaylisyQueries queries={playlist_queries} tag_id={tag.id} />}
      {!tag.is_dynamic_playlist && (
        <TagDetailsTabs tag={tag} pages_total={calc_page_numbers()} current_page={current_page} handle_page_change={handle_page_change} />
      )}
    </div>
  );
};

export default observer(TagDetailsPage);
