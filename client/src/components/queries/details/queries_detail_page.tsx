import { observer } from "mobx-react-lite";
import { Button, ButtonGroup, Grid } from "@mui/material";
import { useParams } from "react-router-dom";
import IPersistentQuery from "../../../models/persistent_query";
import { useEffect, useState } from "react";
import { PersistentQueries } from "../../../api/agent";
import TagsList from "../../tags/util/tags_list";
import IVideoMeta from "../../../models/video_meta";
import { VideoList } from "../../videos/util/video_list";

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
        <Button href={`/queries/delete/${query.id}`} variant="contained" size="medium">
          Delete
        </Button>
      </ButtonGroup>

      <div style={{ marginTop: "20px" }}>
        <h1>{query.name}</h1>
        {query.search_text.length > 0 && <p>Searching for: "{query.search_text}"</p>}
        <Grid container spacing={{ xs: 1, md: 2, lg: 4 }} columns={{ xs: 1, sm: 2, md: 2, lg: 3, xl: 4 }}>
          <Grid item xs={1} sm={1} md={1} lg={1} xl={1} key={query.id + 1}>
            {query.included_tags.length > 0 && (
              <div>
                <h3>Included</h3>
                <TagsList tags={query.included_tags} />
              </div>
            )}
          </Grid>
          <Grid item xs={1} sm={1} md={1} lg={1} xl={1} key={query.id + 2}>
            {query.excluded_tags.length > 0 && (
              <div>
                <h3>Excluded</h3>
                <TagsList tags={query.excluded_tags} />
              </div>
            )}
          </Grid>
          <Grid item xs={1} sm={1} md={1} lg={1} xl={1} key={query.id + 3}>
            {(query.min_rating > 0 || query.max_rating < 10) && (
              <div>
                <h3>Rating</h3>
                From {query.min_rating} to {query.max_rating}
              </div>
            )}
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
