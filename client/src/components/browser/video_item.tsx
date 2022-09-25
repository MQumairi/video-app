import VideoFileIcon from "@mui/icons-material/VideoFile";
import { observer } from "mobx-react-lite";

const VideoItem = (props: any) => {
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
    <a href={props.href} key={props.vid.name}>
      <div
        style={card_style}
        onClick={() => {
          props.fetch_directory(props.dir);
        }}
        key={props.vid.name}
      >
        <VideoFileIcon sx={icon_style} />
        <h4 style={{ textAlign: "center" }}>{props.vid.name}</h4>
        <h5 style={{ textAlign: "center" }}>{props.vid.id}</h5>
      </div>
    </a>
  );
};

export default observer(VideoItem);
