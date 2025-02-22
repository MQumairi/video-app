import { useParams, useSearchParams } from "react-router-dom";
import { Playlist, Video } from "../../../api/agent";
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

const PlaylistPlayer = () => {
  const params = useParams();
  const playlist_id = params.playlist_id;
  const order = params.order;

  const video_store = useContext(VideoStore);
  const query_store = useContext(QueriesStore);

  const [video, set_video] = useState<IVideoMeta | null>(null);
  const [playlist_name, set_playlist_name] = useState<string>("");
  const [current_video_index, set_current_video_index] = useState<number>(0);
  const [next_url, set_next_url] = useState<string>("");
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
    if (!playlist_id || !order) return;
    const res = await Playlist.find_video(+playlist_id, +order);
    if (res.status !== 200) return;
    const fetched_video: IVideoMeta = await fetch_video_meta(res);
    const next_order = res.data.next_video_index;
    const fetched_persistent_query = res.data.persistent_query;
    const fetched_playlist_length = res.data.playlist_length;
    const fetched_playlist_name = res.data.playlist_name;
    set_current_video_index(res.data.order);
    video_store.set_selected_video(fetched_video);
    query_store.set_selected_query(fetched_persistent_query);
    set_video(fetched_video);
    update_query_params("video", fetched_video.id.toString());
    set_next_url(`/playlists/${playlist_id}/order/${next_order}`);
    set_playlist_length(fetched_playlist_length);
    set_playlist_name(fetched_playlist_name);
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

  if (!video || !playlist_id || !order) return <div>Video not found</div>;

  return (
    <div>
      <h1>{video.name}</h1>
      {query_store.selected_query && (
        <a href={`/queries/${query_store.selected_query.id}`}>
          <h2 style={{ opacity: "0.6", marginBottom: "20px" }}>{query_store.selected_query.name}</h2>
        </a>
      )}
      <div>
        <Stack direction="row" spacing={1}>
          {playlist_name.length > 0 && (
            <a href={`/playlists/${playlist_id}`}>
              <Chip label={`${playlist_name}`} color="primary" variant="outlined" />
            </a>
          )}
          {video.id && <Chip label={video.id} color="primary" variant="outlined" />}
          {video.width !== null && <Chip label={calculate_resolution(video)} color="primary" variant="outlined" />}
          {video.views !== null && <Chip label={`${video.views} views`} color="primary" variant="outlined" />}
          {video.size_mb && <Chip label={get_file_size_string(video)} color="primary" variant="outlined" />}
          {order && playlist_length && <Chip label={`${current_video_index}/${playlist_length}`} color="primary" variant="outlined" />}
        </Stack>
      </div>
      <ButtonGroup sx={{ margin: "10px 0px 10px 0px" }} variant="contained">
        <Button href={`/playlists/${playlist_id}/order/1`}>Restart</Button>
        <Button href={`/playlists/${playlist_id}/order/${current_video_index}`}>Refresh</Button>
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

export default observer(PlaylistPlayer);
