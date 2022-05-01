import { base_url } from "../../api/agent";
import { PathConverter } from "../../util/path_converter";

export const VideoPlayer = (props: any) => {
  const box_style = {
    width: "100%",
    height: "auto",
    margin: "auto",
    display: "flex",
    justifyContent: "center",
    marginTop: "20px",
  };

  const video_style = {
    width: "90%",
    height: "auto",
  };

  return (
    <div style={box_style}>
      <video style={video_style} width="1000" height="500" controls autoPlay loop playsInline>
        <source src={`${base_url}/videos/${PathConverter.to_query(props.vid_path)}`} type="video/mp4" />
      </video>
    </div>
  );
};
