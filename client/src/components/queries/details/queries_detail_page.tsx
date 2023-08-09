import { observer } from "mobx-react-lite";
import { Button, ButtonGroup } from "@mui/material";
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
        <Button href="/queries" variant="contained" size="medium">
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
        <TagsList tags={query.included_tags} />
        <h3>Videos</h3>
        <Button onClick={handle_preview}>Preview</Button>
        <VideoList videos={query_videos} base={`/queries/${query.id}/video`} />
      </div>
    </div>
  );
};

export default observer(QueriesDetailsPage);
