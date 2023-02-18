import { useParams, useSearchParams } from "react-router-dom";
import { PathConverter } from "../../util/path_converter";
import IVideoMeta from "../../models/video_meta";
import { Playlist, Search, Tag, Video } from "../../api/agent";
import { useContext, useEffect, useState } from "react";
import VideoPlayer from "./video_player";
import { observer } from "mobx-react-lite";
import SelectedVideosStore from "../../store/selected_videos_store";
import { Button, ButtonGroup, Chip, Rating, Stack } from "@mui/material";
import { Star } from "@mui/icons-material";
import PlayerTabs from "./player_tabs";
import { calculate_resolution } from "../../lib/video_file_meta_calculator";

const PlayerPage = () => {
  let vid_path = useParams().vid_path ?? "videos";
  let tag_id = useParams().tag_id;
  let playlist_id = useParams().playlist_id;

  const selectedVideoStore = useContext(SelectedVideosStore);

  const [video_meta, set_video_meta] = useState<IVideoMeta | null>(null);
  const [random_vid_url, set_random_vid_url] = useState<string>("");
  const [back_url, set_back_url] = useState<string>("");
  const [video_rating, set_video_rating] = useState<number>(0);
  const [search_params, _] = useSearchParams({});

  const fetch_video_meta = async (query: string) => {
    const api_query = PathConverter.to_query(query);
    const received_video: IVideoMeta = (await Video.get(api_query)).data;
    if (received_video && back_url === "") {
      // Set back url if we came from file system
      set_back_url(`/browser/${PathConverter.to_query(received_video.parent_path)}`);
    }
    console.log("received:", received_video);
    selectedVideoStore.set_running_video(received_video);
    selectedVideoStore.set_single_selection(received_video);
    set_video_meta(received_video);
    set_video_rating(received_video.rating);
  };

  const set_button_urls = async () => {
    // Query parameters used for Search
    const params = search_params.toString();
    // If we came from /tag/x
    if (tag_id) {
      let res = await Search.shuffle(`tags=${tag_id}`);
      set_random_vid_url(`/tags/${tag_id}/video/${PathConverter.to_query(res.path)}`);
      set_back_url(`/tags/${tag_id}`);
    }
    // If we came from /playlists/x
    else if (playlist_id) {
      let response: IVideoMeta = (await Playlist.shuffle(+playlist_id)).data;
      set_random_vid_url(`/playlists/${playlist_id}/video/${PathConverter.to_query(response.path)}`);
      set_back_url(`/playlists/${playlist_id}`);
    }
    // If we came from /search?x
    else if (params) {
      let response = await Search.shuffle(params);
      set_random_vid_url(`/player/${PathConverter.to_query(response.path)}?${params}`);
      set_back_url(`/search?${params}`);
    }
  };

  const update_video_rating = async (new_rating: number | null) => {
    const api_query = PathConverter.to_query(vid_path);
    set_video_rating(new_rating ?? 0);
    if (video_meta && new_rating != null) {
      video_meta.rating = new_rating;
      await Video.rate(api_query, video_meta);
    }
  };

  useEffect(() => {
    fetch_video_meta(vid_path);
    set_button_urls();
  }, [back_url]);

  if (!video_meta) {
    return <h2>Loading video...</h2>;
  }

  return (
    <div>
      <h1>{video_meta.name}</h1>
      <div>
        <Stack direction="row" spacing={1}>
          <Chip label={video_meta?.id} color="primary" variant="outlined" />
          <Chip label={calculate_resolution(video_meta)} color="primary" variant="outlined" />
        </Stack>
      </div>
      <ButtonGroup sx={{ margin: "10px 0px 10px 0px" }} variant="contained">
        <Button href={back_url}>Back</Button>
        {random_vid_url != "" && <Button href={random_vid_url}>Random</Button>}
      </ButtonGroup>
      <VideoPlayer vid_path={vid_path} />{" "}
      <Rating
        name="simple-controlled"
        value={video_rating}
        size="large"
        style={{ marginTop: "30px", marginBottom: "5px" }}
        onChange={(_, newValue) => {
          update_video_rating(newValue);
        }}
        emptyIcon={<Star style={{ opacity: 0.8, color: "grey", fontSize: "50px" }} fontSize="inherit" />}
        icon={<Star style={{ opacity: 0.8, color: "#ffcc00", fontSize: "50px" }} fontSize="inherit" />}
        max={10}
      />
      <PlayerTabs video={video_meta} />
    </div>
  );
};

export default observer(PlayerPage);
