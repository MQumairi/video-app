import { Box } from "@mui/material";
import { VideoItem } from "./video_item";

export const DirectoryVideos = (props: any) => {
  const box_style = {
    background: "#01141f",
    display: "flex",
    padding: "15px",
    marginTop: "20px",
  };

  return (
    <Box component="div" sx={box_style}>
      {props.video_paths.map((vid: any) => {
        return <VideoItem vid={vid} key={vid.name} />;
      })}
    </Box>
  );
};
