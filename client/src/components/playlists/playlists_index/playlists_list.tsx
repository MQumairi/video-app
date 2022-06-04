import { Box } from "@mui/material";
import { observer } from "mobx-react-lite";
import PlaylistItem from "./playlist_item";

const PlaylistsList = (props: any) => {
  const box_style = {
    background: "#01141f",
    display: "flex",
    flexWrap: "wrap",
    padding: "15px",
    marginTop: "20px",
  };
  return (
    <Box component="div" sx={box_style}>
      {props.playlists?.map((playlist: any) => {
        return <PlaylistItem key={playlist.name} playlist={playlist} />;
      })}
    </Box>
  );
};

export default observer(PlaylistsList);
