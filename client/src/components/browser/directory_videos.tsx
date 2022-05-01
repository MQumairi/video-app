import { Box } from "@mui/material";
import { PathConverter } from "../../util/path_converter";
import { VideoItem } from "./video_item";

export const DirectoryVideos = (props: any) => {
  const box_style = {
    background: "#01141f",
    display: "flex",
    flexWrap: "wrap",
    padding: "15px",
    marginTop: "20px",
  };

  return (
    <Box component="div" sx={box_style}>
      {props.video_paths.map((vid: any) => {
        return <VideoItem href={`/player/${PathConverter.to_query(vid.path)}`} vid={vid} key={vid.name} />;
      })}
    </Box>
  );
};
