import { Box } from "@mui/material";
import { PlaylistItem } from "./playlist_item";

export const PlaylistsList = (props: any) => {
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
        return <PlaylistItem key={playlist.name} playlist={playlist}/>;
      })}
    </Box>
  );
};
