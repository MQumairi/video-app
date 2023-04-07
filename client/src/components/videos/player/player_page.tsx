import { useParams, useSearchParams } from "react-router-dom";
import { PathConverter } from "../../../util/path_converter";
import IVideoMeta from "../../../models/video_meta";
import { Search, Video } from "../../../api/agent";
import { useContext, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import VideoStore from "../../../store/video_store";
import Video_details from "./video_details";

const PlayerPage = () => {
  let vid_path = useParams().vid_path ?? "videos";
  let tag_id = useParams().tag_id;

  const video_store = useContext(VideoStore);

  const [random_vid_url, set_random_vid_url] = useState<string>("");
  const [back_url, set_back_url] = useState<string>("");
  const [search_params] = useSearchParams({});

  const fetch_video_meta = async (query: string) => {
    const api_query = PathConverter.to_query(query);
    const res = await Video.details_from_path(api_query);
    if (res.status !== 200) return;
    const received_video: IVideoMeta = res.data;
    if (received_video && back_url === "") {
      // Set back url if we came from file system
      set_back_url(`/browser/${PathConverter.to_query(received_video.parent_path)}`);
    }
    video_store.set_selected_video(received_video);
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
    // If we came from /search?x
    else if (params) {
      let response = await Search.shuffle(params);
      set_random_vid_url(`/player/${PathConverter.to_query(response.path)}?${params}`);
      set_back_url(`/search?${params}`);
    }
  };

  useEffect(() => {
    fetch_video_meta(vid_path);
    set_button_urls();
    // eslint-disable-next-line
  }, [back_url]);

  return <Video_details back_url={back_url} random_url={random_vid_url} />;
};

export default observer(PlayerPage);
