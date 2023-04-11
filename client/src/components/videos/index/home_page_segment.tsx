import IVideoMeta from "../../../models/video_meta";
import { VideoList } from "../util/video_list";

interface IProps {
  title: string;
  videos: IVideoMeta[];
}

const HomePageSegment = (props: IProps) => {
  const style = {
    marginTop: "30px",
  };
  return (
    <div style={style}>
      <h2>{props.title}</h2>
      <VideoList videos={props.videos} base="/player" />
    </div>
  );
};

export default HomePageSegment;
