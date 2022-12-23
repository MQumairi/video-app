import { Box } from "@mui/material";
import { PathConverter } from "../../util/path_converter";
import VideoItem from "./video_item";
import { observer } from "mobx-react-lite";
import IVideoMeta from "../../models/video_meta";

interface IProps {
  videos: IVideoMeta[]
}

export const DirectoryVideos = (props: IProps) => {
  const box_style = {
    background: "#01141f",
    display: "flex",
    flexWrap: "wrap",
    padding: "15px",
    marginTop: "20px",
  };

  return (
    <Box component="div" sx={box_style}>
      {props.videos.map((vid) => {
        return <VideoItem url={`/player/${PathConverter.to_query(vid.path)}`} video={vid} key={vid.id} />;
      })}
    </Box>
  );
};

export default observer(DirectoryVideos);
