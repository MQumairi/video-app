import { useParams } from "react-router-dom";
import { PathConverter } from "../../util/path_converter";
import IVideoMeta from "../../models/video_meta";
import { Video } from "../../api/agent";
import { useEffect, useState } from "react";
import { AppButton } from "../misc/app_button";
import { VideoPlayer } from "./video_player";

export const PlayerPage = () => {
  let vid_path = useParams().vid_path ?? "data";
  const [video_meta, set_video_meta] = useState<IVideoMeta | null>(null);

  const fetch_video_meta = async (query: string) => {
    const api_query = PathConverter.to_query(query);
    const responded_directory: IVideoMeta = (await Video.get(api_query)).data;
    set_video_meta(responded_directory);
  };

  useEffect(() => {
    fetch_video_meta(vid_path);
  }, []);

  const get_parent_path = () => {
    const query = (video_meta && PathConverter.to_query(video_meta.parent_path)) ?? "/";
    return `/browser/${query}`;
  };

  return (
    <div>
      <h1>{video_meta?.name}</h1>
      <AppButton href={get_parent_path()} textContent="Back" />
      <VideoPlayer vid_path={vid_path} />
    </div>
  );
};
