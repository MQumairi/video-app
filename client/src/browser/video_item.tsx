import VideoFileIcon from "@mui/icons-material/VideoFile";
import { PathConverter } from "../util/path_converter";

export const VideoItem = (props: any) => {
  const card_style = {
    margin: "30px",
    width: "100px",
    height: "auto",
    overflow: "hidden",
  };
  const icon_style = {
    width: "100px",
    height: "auto",
    textAlign: "center",
  };
  return (
    <a href={`/player/${PathConverter.to_query(props.vid.path)}`} key={props.vid.name}>
      <div
        style={card_style}
        onClick={() => {
          props.fetch_directory(props.dir);
        }}
      >
        <VideoFileIcon sx={icon_style} />
        <h4 style={{ textAlign: "center" }}>{props.vid.name}</h4>
      </div>
    </a>
  );
};
