import { Box } from "@mui/material";
import { observer } from "mobx-react-lite";
import IVideoMeta from "../../../models/video_meta";
import VideoList from "../../videos/video_list";

interface IProps {
  videos: IVideoMeta[];
  playlist_id: number;
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
      <VideoList base={`/playlists/${props.playlist_id}/video`} videos={props.videos} />
    </Box>
  );
};

export default observer(PlaylistVideoList);
