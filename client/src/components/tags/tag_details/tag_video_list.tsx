import { Box } from "@mui/material";
import { VideoItem } from "../../browser/video_item";

export const TagVideoList = (props: any) => {
  const box_style = {
    background: "#01141f",
    display: "flex",
    flexWrap: "wrap",
    padding: "15px",
    marginTop: "20px",
  };

  return (
    <Box component="div" sx={box_style}>
      {props.videos?.map((vid: any) => {
        return <VideoItem key={vid.name} vid={vid} />;
      })}
    </Box>
  );
};
