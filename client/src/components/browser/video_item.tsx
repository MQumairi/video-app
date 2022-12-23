import VideoFileIcon from "@mui/icons-material/VideoFile";
import { observer } from "mobx-react-lite";
import IVideoMeta from "../../models/video_meta";


interface IProps {
  video: IVideoMeta
  url: string;
}

const VideoItem = (props: IProps) => {
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
    <a href={props.url} key={props.video.name}>
      <div
        style={card_style}
        key={props.video.name}
      >
        <VideoFileIcon sx={icon_style} />
        <h4 style={{ textAlign: "center" }}>{props.video.name}</h4>
        <h5 style={{ textAlign: "center" }}>{props.video.id}</h5>
      </div>
    </a>
  );
};

export default observer(VideoItem);
