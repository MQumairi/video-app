import { observer } from "mobx-react-lite";
import { base_url } from "../../api/agent";
import { PathConverter } from "../../util/path_converter";

const VideoPlayer = (props: any) => {
  const box_style = {
    margin: "auto",
    display: "flex",
    justifyContent: "center",
    marginTop: "20px",
  };

  const video_style = {
    maxWidth: "100%",
    maxHeight: "100vh",
  };

  return (
    <div style={box_style}>
      <video style={video_style} width="1000" height="500" controls autoPlay loop playsInline>
        <source src={`${base_url}/videos/${PathConverter.to_query(props.vid_path)}`} type="video/mp4" />
      </video>
    </div>
  );
};

export default observer(VideoPlayer);
