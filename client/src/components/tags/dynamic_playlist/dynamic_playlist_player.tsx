import { useParams } from "react-router-dom";
import { Tag, Video } from "../../../api/agent";
import { useContext, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import VideoStore from "../../../store/video_store";
import IVideoMeta from "../../../models/video_meta";
import { Button, ButtonGroup, Chip, FormGroup, Stack } from "@mui/material";
import { calculate_resolution, get_file_size_string } from "../../../lib/video_file_meta_calculator";
import VideoPlayer from "../../videos/player/video_player";
import RatingStars from "../../misc/rating_stars";
import PlayerTabs from "../../videos/player/player_tabs";
import IPersistentQuery from "../../../models/persistent_query";

const DynamicPlaylistPlayer = () => {
  const params = useParams();
  const tag_id = params.tag_id;
  const order = params.order;

  const video_store = useContext(VideoStore);

  const [video, set_video] = useState<IVideoMeta | null>(null);
  const [next_url, set_next_url] = useState<string>("");
  const [prev_url, set_prev_url] = useState<string>("");
  const [persistent_query, set_persistent_query] = useState<IPersistentQuery | null>(null);
  const [playlist_length, set_playlist_length] = useState<number>(0);

  const fetch_video_meta = async () => {
    if (!tag_id || !order) return;
    const res = await Tag.dynamic_playlist_video(+tag_id, +order);
    if (res.status !== 200) return;
    const fetched_video = res.data.video;
    const next_order = res.data.next;
    const fetched_persistent_query = res.data.persistent_query;
    const fetched_playlist_length = res.data.playlist_length;
    video_store.set_selected_video(fetched_video);
    set_video(fetched_video);
    set_next_url(`/dynamic-playlist/${tag_id}/order/${next_order}`);
    set_prev_url(`/dynamic-playlist/${tag_id}/order/${next_order - 2}`);
    set_persistent_query(fetched_persistent_query);
    set_playlist_length(fetched_playlist_length);
  };

  const handle_rating_change = async (rating: number | null) => {
    console.log("entered handle_rating_change");
    const new_rating = rating || 0;
    if (!video) return;
    console.log(`new_rating=${new_rating}, video=${video.name}`);
    video_store.set_selected_video_rating(new_rating);
    const res = await Video.rate(video, new_rating);
    if (res.status !== 200) return;
  };

  useEffect(() => {
    fetch_video_meta();
    // eslint-disable-next-line
  }, []);

  if (!video || !tag_id || !order) return <div>Video not found</div>;

  return (
    <div>
      <h1>{video.name}</h1>
      {persistent_query && (
        <a href={`/tags/${tag_id}`}>
          <h2 style={{ opacity: "0.6", marginBottom: "20px" }}>{persistent_query.name}</h2>
        </a>
      )}
      <div>
        <Stack direction="row" spacing={1}>
          {video.id && <Chip label={video.id} color="primary" variant="outlined" />}
          {video.width !== null && <Chip label={calculate_resolution(video)} color="primary" variant="outlined" />}
          {video.views !== null && <Chip label={`${video.views} views`} color="primary" variant="outlined" />}
          {video.size_mb && <Chip label={get_file_size_string(video)} color="primary" variant="outlined" />}
          {order && playlist_length && <Chip label={`${order}/${playlist_length}`} color="primary" variant="outlined" />}
        </Stack>
      </div>
      <ButtonGroup sx={{ margin: "10px 0px 10px 0px" }} variant="contained">
        {+order > 1 && <Button href={prev_url}>Previous</Button>}
        <Button href={next_url}>Next</Button>
      </ButtonGroup>
      <VideoPlayer vid_path={video.path} />
      <FormGroup sx={{ marginTop: "30px" }}>
        <RatingStars default_rating={video.rating} rating={video_store.selected_video_rating} set_rating={handle_rating_change} />
      </FormGroup>
      <PlayerTabs />
    </div>
  );
};

export default observer(DynamicPlaylistPlayer);
