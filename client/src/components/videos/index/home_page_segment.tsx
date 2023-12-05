import { useEffect, useState } from "react";
import IVideoMeta from "../../../models/video_meta";
import { VideoList } from "../util/video_list";
import { Button } from "@mui/material";

interface IProps {
  title: string;
  video_fetcher: () => Promise<IVideoMeta[]>;
}

const HomePageSegment = (props: IProps) => {
  const [segment_videos, set_segment_videos] = useState<IVideoMeta[]>([]);

  const lookup_videos = async () => {
    const videos = await props.video_fetcher();
    set_segment_videos(videos);
  };

  const style = {
    marginTop: "30px",
  };

  useEffect(() => {
    lookup_videos();
    // eslint-disable-next-line
  }, []);

  return (
    <div style={style}>
      <h2>{props.title}</h2>
      <Button
        onClick={() => {
          lookup_videos();
        }}
      >
        Reload
      </Button>
      <VideoList videos={segment_videos} base="/player" />
    </div>
  );
};

export default HomePageSegment;
