import { observer } from "mobx-react-lite";
import { base_url } from "../../../api/agent";
import { PathConverter } from "../../../util/path_converter";

const VideoPlayer = (props: any) => {
  const box_style = {
    margin: "auto",
    display: "flex",
    justifyContent: "center",
    marginTop: "20px",
  };

  const video_style = {
    minWidth: "100%",
    height: "auto",
    maxHeight: "500px",
  };

  return (
    <div style={box_style}>
      <video style={video_style} width="1000" height="500" controls loop playsInline>
        <source src={`${base_url}/videos/stream/${PathConverter.to_query(props.vid_path)}`} type="video/mp4" />
      </video>
    </div>
  );
};

export default observer(VideoPlayer);
