import { observer } from "mobx-react-lite";
import { base_url } from "../../../api/agent";
import { PathConverter } from "../../../util/path_converter";
import { useState } from "react";

const VideoPlayer = (props: any) => {
  const [volume, set_volume] = useState<number>(0.5);

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

  const handle_volume_change = (event: any) => {
    const video_element = event.target;
    const video_volume = video_element.volume;
    console.log(video_volume);
    set_volume(video_volume);
  };

  const handle_on_load_start = (event: any) => {
    const video_element = event.target;
    video_element.volume = 0.3;
  };

  return (
    <div style={box_style}>
      <video
        style={video_style}
        width="1000"
        height="500"
        controls
        loop
        playsInline
        onLoadStart={(event) => {
          handle_on_load_start(event);
        }}
        onVolumeChange={(event) => {
          handle_volume_change(event);
        }}
      >
        <source src={`${base_url}/videos/stream/${PathConverter.to_query(props.vid_path)}`} type="video/mp4" />
      </video>
    </div>
  );
};

export default observer(VideoPlayer);
