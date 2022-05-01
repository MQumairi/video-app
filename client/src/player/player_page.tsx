import { useParams } from "react-router-dom";
import { PathConverter } from "../util/path_converter";

export const PlayerPage = () => {
  let vid_path = useParams().vid_path ?? "data";
  let vid_query = PathConverter.to_query(vid_path);
  return (
    <div>
      <h1>Player Page</h1>
      <p>{vid_path}</p>
      <p>{vid_query}</p>
    </div>
  );
};
