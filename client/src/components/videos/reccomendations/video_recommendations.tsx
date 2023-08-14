import { observer } from "mobx-react-lite";
import IVideoMeta from "../../../models/video_meta";
import { useEffect, useState } from "react";
import { Button, ButtonGroup, FormLabel } from "@mui/material";
import { VideoList } from "../util/video_list";
import { PersistentQueries, Video } from "../../../api/agent";
import IPersistentQuery from "../../../models/persistent_query";

interface IProps {
  video: IVideoMeta;
  query?: IPersistentQuery;
}

const VideoReccomendations = (props: IProps) => {
  const [similar_videos, set_similar] = useState<IVideoMeta[]>([]);
  const [player_base, set_player_base] = useState<string>("/player");

  const fetch_persistent_query_recs = async (): Promise<IVideoMeta[]> => {
    if (!props.query) return [];
    const res = await PersistentQueries.preview_videos(props.query);
    set_player_base(window.location.pathname);
    return res.data.videos;
  };

  const fetch_videos_recs = async (): Promise<IVideoMeta[]> => {
    const res = await Video.similar(props.video);
    if (res.status !== 200) return [];
    return res.data;
  };

  const fetch_similar_videos = async () => {
    if (props.query) return set_similar(await fetch_persistent_query_recs());
    set_similar(await fetch_videos_recs());
  };

  useEffect(() => {
    fetch_similar_videos();
  }, []);

  return (
    <div>
      <FormLabel onClick={fetch_similar_videos}>Similar Videos</FormLabel>
      <VideoList base={player_base} videos={similar_videos} />
    </div>
  );
};

export default observer(VideoReccomendations);
