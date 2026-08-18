import { observer } from "mobx-react-lite";
import { Button, ButtonGroup, Grid } from "@mui/material";
import { useParams } from "react-router-dom";
import IPersistentQuery from "../../../models/persistent_query";
import { useEffect, useState } from "react";
import { PersistentQueries } from "../../../api/agent";
import TagsList from "../../tags/util/tags_list";
import IVideoMeta from "../../../models/video_meta";
import { VideoList } from "../../videos/util/video_list";
import ITag from "../../../models/tag";
import { resolution_from_height } from "../../../lib/video_file_meta_calculator";

const none_label = "None";

// The details view mirrors the create/edit forms, so every field is rendered even when unset.
const tags_or_none = (tags: ITag[] | undefined) => {
  if (!tags || tags.length === 0) return <p>{none_label}</p>;
  return <TagsList tags={tags} />;
};

const QueriesDetailsPage = () => {
  let query_id = useParams().query_id ?? 1;
  const [query, set_query] = useState<IPersistentQuery | null>(null);
  const [query_videos, set_query_videos] = useState<IVideoMeta[]>([]);

  const handle_preview = async () => {
    if (!query) return;
    const video_res = await PersistentQueries.preview_videos(query);
    if (video_res.status !== 200) return;
    set_query_videos(video_res.data.videos);
  };

  const handle_duplicate = async () => {
    if (!query) return;
    const res = await PersistentQueries.duplicate(query.id);
    if (res.status !== 201) return;
    window.location.href = `/queries/${res.data.id}`;
  };

  const fetch_query = async () => {
    const res = await PersistentQueries.details(+query_id);
    if (res.status !== 200) return;
    set_query(res.data);
    const video_res = await PersistentQueries.preview_videos(res.data);
    if (video_res.status !== 200) return;
    set_query_videos(video_res.data.videos);
  };

  useEffect(() => {
    fetch_query();
    // eslint-disable-next-line
  }, []);

  if (!query) {
    return (
      <div>
        <Button href="/queries" variant="contained" size="large">
          Back
        </Button>
        <h2>Query Not Found</h2>
      </div>
    );
  }

  return (
    <div>
      <ButtonGroup>
        <Button href="/playlists?tags_index_tab=1" variant="contained" size="medium">
          Back
        </Button>
        <Button href={`/queries/${query.id}/edit`} variant="contained" size="medium">
          Edit
        </Button>
        <Button onClick={handle_duplicate} variant="contained" size="medium">
          Duplicate
        </Button>
        <Button href={`/queries/delete/${query.id}`} variant="contained" size="medium">
          Delete
        </Button>
      </ButtonGroup>

      <div style={{ marginTop: "20px" }}>
        <h1>{query.name}</h1>
        <Grid container spacing={{ xs: 1, md: 2, lg: 4 }} columns={{ xs: 1, sm: 2, md: 2, lg: 3, xl: 4 }}>
          <Grid item xs={1} sm={1} md={1} lg={1} xl={1} key="rating">
            <h3>Rating</h3>
            <p>
              From {query.min_rating} to {query.max_rating}
            </p>
          </Grid>
          <Grid item xs={1} sm={1} md={1} lg={1} xl={1} key="quality">
            <h3>Quality</h3>
            <p>{resolution_from_height(+query.frame_height)}</p>
          </Grid>
          <Grid item xs={1} sm={1} md={1} lg={1} xl={1} key="search">
            <h3>Search</h3>
            <p>{query.search_text.length > 0 ? `"${query.search_text}"` : none_label}</p>
          </Grid>
          <Grid item xs={1} sm={1} md={1} lg={1} xl={1} key="included">
            <h3>Included</h3>
            {tags_or_none(query.included_tags)}
          </Grid>
          <Grid item xs={1} sm={1} md={1} lg={1} xl={1} key="excluded">
            <h3>Excluded</h3>
            {tags_or_none(query.excluded_tags)}
          </Grid>
          <Grid item xs={1} sm={1} md={1} lg={1} xl={1} key="studios">
            <h3>Studios</h3>
            {tags_or_none(query.studios)}
          </Grid>
          <Grid item xs={1} sm={1} md={1} lg={1} xl={1} key="fairness">
            <h3>Fairness</h3>
            {tags_or_none(query.fairness_tags)}
          </Grid>
        </Grid>

        <h3>Videos</h3>
        <Button onClick={handle_preview}>Preview</Button>
        <VideoList videos={query_videos} base={`/queries/${query.id}/video`} />
      </div>
    </div>
  );
};

export default observer(QueriesDetailsPage);
