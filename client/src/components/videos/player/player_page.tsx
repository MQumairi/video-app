import { useParams, useSearchParams } from "react-router-dom";
import { PathConverter } from "../../../util/path_converter";
import { Search } from "../../../api/agent";
import { useContext, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import VideoStore from "../../../store/video_store";
import VideoDetails from "./video_details";

const PlayerPage = () => {
  const params = useParams();
  const vid_path = params.vid_path;
  const vid_id = params.vid_id;
  const tag_id = params.tag_id;

  const video_store = useContext(VideoStore);

  const [random_vid_url, set_random_vid_url] = useState<string>("");
  const [back_url, set_back_url] = useState<string>("");
  const [search_params] = useSearchParams({});

  const fetch_video_meta = async () => {
    if (vid_path) await video_store.lookup_selected_video_from_path(vid_path);
    else if (vid_id) await video_store.lookup_selected_video(+vid_id);
    if (!video_store.selected_video || back_url !== "") return;
    // Set back url if we came from file system
    set_back_url(`/browser/${PathConverter.to_query(video_store.selected_video.parent_path)}`);
  };

  const set_button_urls = async () => {
    // Query parameters used for Search
    const params = search_params.toString();
    // If we came from /tag/x
    if (tag_id) {
      let random_video = await Search.shuffle(`tags=${tag_id}`);
      set_random_vid_url(`/tags/${tag_id}/video/${random_video.id}`);
      set_back_url(`/tags/${tag_id}`);
    }
    // If we came from /search?x
    else if (params) {
      let random_video = await Search.shuffle(params);
      set_random_vid_url(`/player/${random_video.id}?${params}`);
      set_back_url(`/search?${params}`);
    }
  };

  useEffect(() => {
    fetch_video_meta();
    set_button_urls();
    // eslint-disable-next-line
  }, [back_url]);

  return <VideoDetails back_url={back_url} random_url={random_vid_url} />;
};

export default observer(PlayerPage);
