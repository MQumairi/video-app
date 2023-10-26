import { useParams, useSearchParams } from "react-router-dom";
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
import { AxiosResponse } from "axios";
import QueriesStore from "../../../store/queries_store";

const PlaylistPlayerPage = () => {
  const params = useParams();
  const tag_id = params.tag_id;
  const order = params.order;

  const video_store = useContext(VideoStore);
  const query_store = useContext(QueriesStore);

  const [video, set_video] = useState<IVideoMeta | null>(null);
  const [next_url, set_next_url] = useState<string>("");
  const [prev_url, set_prev_url] = useState<string>("");
  const [playlist_length, set_playlist_length] = useState<number>(0);
  const [query_params, set_query_params] = useSearchParams({});

  const update_query_params = (key: string, value: string) => {
    const new_query_params = query_params;
    new_query_params.set(key, value);
    set_query_params(new_query_params);
  };

  const fetch_video_meta = async (res: AxiosResponse): Promise<IVideoMeta> => {
    const video_query_id = query_params.get("video");
    if (video_query_id) {
      const video_res = await Video.details(+video_query_id);
      if (video_res.status === 200) {
        const received_video: IVideoMeta = video_res.data;
        return received_video;
      }
    }
    const fetched_playlist_video: IVideoMeta = res.data.video;
    return fetched_playlist_video;
  };

  const fetch_dynamic_playlist_player_data = async () => {
    if (!tag_id || !order) return;
    const res = await Tag.dynamic_playlist_video(+tag_id, +order);
    if (res.status !== 200) return;
    const next_order = res.data.next;
    const fetched_persistent_query = res.data.persistent_query;
    const fetched_playlist_length = res.data.playlist_length;
    set_next_url(`/playlists/${tag_id}/order/${next_order}`);
    set_prev_url(`/playlists/${tag_id}/order/${+order - 1}`);
    set_playlist_length(fetched_playlist_length);
    query_store.set_selected_query(fetched_persistent_query);
    const fetched_video: IVideoMeta = await fetch_video_meta(res);
    if (!fetched_video) return;
    video_store.set_selected_video(fetched_video);
    set_video(fetched_video);
    update_query_params("video", fetched_video.id.toString());
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
    fetch_dynamic_playlist_player_data();
    // eslint-disable-next-line
  }, []);

  if (!video || !tag_id || !order)
    return (
      <div>
        {query_store.selected_query && <h2 style={{ opacity: "0.6", marginBottom: "20px" }}>{query_store.selected_query.name}</h2>}
        Video not found. Try <a href={next_url}>next video in playlist</a>.
      </div>
    );

  return (
    <div>
      <h1>{video.name}</h1>
      {query_store.selected_query && (
        <a href={`/playlists/${tag_id}`}>
          <h2 style={{ opacity: "0.6", marginBottom: "20px" }}>{query_store.selected_query.name}</h2>
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
        <Button href={`/playlists/${tag_id}`}>Back</Button>
        <Button href={`/playlists/${tag_id}/order/${order}`}>Refresh</Button>
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

export default observer(PlaylistPlayerPage);
