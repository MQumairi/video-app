import { useParams } from "react-router-dom";
import { PathConverter } from "../../util/path_converter";
import IVideoMeta from "../../models/video_meta";
import { Directory, Playlist, Tag, Video } from "../../api/agent";
import { useContext, useEffect, useState } from "react";
import HrefButton from "../misc/href_button";
import VideoPlayer from "./video_player";
import TagVideoPopover from "../tags/tag_popover/tag_video_popover";
import VideoTags from "./video_tags";
import PlaylistVideoPopover from "../popovers/playlist_popover/playlists_video_popover";
import { observer } from "mobx-react-lite";
import SelectedVideosStore from "../../store/selected_videos_store";
import TagPopoverButton from "../tags/tag_popover/tag_popover_button";
import PlaylistPopoverButton from "../popovers/playlist_popover/playlist_popover_button";
import { Rating } from "@mui/material";
import { Star } from "@mui/icons-material";

const PlayerPage = () => {
  let vid_path = useParams().vid_path ?? "videos";
  let tag_id = useParams().tag_id;
  let playlist_id = useParams().playlist_id;

  const selectedVideoStore = useContext(SelectedVideosStore);

  const [video_meta, set_video_meta] = useState<IVideoMeta | null>(null);
  const [random_vid_url, set_random_vid_url] = useState<string>("");
  const [video_rating, set_video_rating] = useState<number>(0);

  const fetch_video_meta = async (query: string) => {
    const api_query = PathConverter.to_query(query);
    const received_video: IVideoMeta = (await Video.get(api_query)).data;
    console.log("received:", received_video);
    selectedVideoStore.set_running_video(received_video);
    selectedVideoStore.set_single_selection(received_video);
    set_video_meta(received_video);
    set_video_rating(received_video.rating);
  };

  const fetch_random_tag_video = async () => {
    if (tag_id) {
      let response: IVideoMeta = (await Tag.shuffle(+tag_id)).data;
      set_random_vid_url(`/tags/${tag_id}/video/${PathConverter.to_query(response.path)}`);
    } else if (playlist_id) {
      let response: IVideoMeta = (await Playlist.shuffle(+playlist_id)).data;
      set_random_vid_url(`/playlists/${playlist_id}/video/${PathConverter.to_query(response.path)}`);
    } else {
      // Advanced Search query
      let response = await Directory.adv_search_shuffle();
      set_random_vid_url(`/player/${PathConverter.to_query(response.path)}`);
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
    fetch_random_tag_video();
  }, []);

  const get_parent_path = () => {
    const query = (video_meta && PathConverter.to_query(video_meta.parent_path)) ?? "/";
    return `/browser/${query}`;
  };

  return (
    <div>
      <h1>{video_meta?.name}</h1>
      <HrefButton href={get_parent_path()} textContent="Back" />
      <TagPopoverButton />
      <PlaylistPopoverButton />
      {random_vid_url != "" && <HrefButton textContent="Random" href={random_vid_url} />}
      {selectedVideoStore.tag_popover_visible && <TagVideoPopover />}
      {selectedVideoStore.playlist_popover_visible && <PlaylistVideoPopover />}
      <VideoPlayer vid_path={vid_path} />
      <Rating
        name="simple-controlled"
        value={video_rating}
        size="large"
        style={{ marginTop: "30px", marginBottom: "5px" }}
        onChange={(event, newValue) => {
          console.log("new value:", newValue);
          update_video_rating(newValue);
        }}
        emptyIcon={<Star style={{ opacity: 0.8, color: "grey", fontSize: "50px" }} fontSize="inherit" />}
        icon={<Star style={{ opacity: 0.8, color: "#ffcc00", fontSize: "50px" }} fontSize="inherit" />}
      />
      <VideoTags tags={video_meta?.tags ?? []} />
    </div>
  );
};

export default observer(PlayerPage);
