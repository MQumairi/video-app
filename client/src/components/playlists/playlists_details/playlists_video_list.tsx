import { Box } from "@mui/material";
import { PathConverter } from "../../../util/path_converter";
import VideoItem from "../../browser/video_item";
import { observer } from "mobx-react-lite";
import IVideoMeta from "../../../models/video_meta";

interface IProps {
  videos: IVideoMeta[]
  playlist_id: number
}

const PlaylistVideoList = (props: IProps) => {
  const box_style = {
    background: "#01141f",
    display: "flex",
    flexWrap: "wrap",
    padding: "15px",
    marginTop: "20px",
  };

  return (
    <Box component="div" sx={box_style}>
      {props.videos && props.videos.map((vid) => {
        return <VideoItem url={`/playlists/${props.playlist_id}/video/${PathConverter.to_query(vid.path)}`} key={vid.id} video={vid} />;
      })}
    </Box>
  );
};

export default observer(PlaylistVideoList);
