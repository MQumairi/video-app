import { useParams } from "react-router-dom";
import { PathConverter } from "../util/path_converter";
import IVdeoMeta from "../models/video_meta";
import { base_url, Video } from "../api/agent";
import { useEffect, useState } from "react";

export const PlayerPage = () => {
  let vid_path = useParams().vid_path ?? "data";
  const [video_meta, set_video_meta] = useState<IVdeoMeta | null>(null);

  const fetch_video_meta = async (query: string) => {
    const api_query = PathConverter.to_query(query);
    const responded_directory: IVdeoMeta = (await Video.get(api_query)).data;
    set_video_meta(responded_directory);
  };

  useEffect(() => {
    fetch_video_meta(vid_path);
  }, []);

  return (
    <div>
      <h1>Player Page</h1>
      <p>{vid_path}</p>
      <p>{video_meta?.name}</p>
      <p>{video_meta?.path}</p>
      <b>Go Back: </b>
      <a href={`/browser/${PathConverter.to_query(video_meta?.parent_path ?? "data")}`}>Back</a>
      <video width="1000" height="500" controls autoPlay loop playsInline>
        <source src={`${base_url}/videos/${PathConverter.to_query(vid_path)}`} type="video/mp4" />
      </video>
    </div>
  );
};
