import { Box } from "@mui/material";
import { observer } from "mobx-react-lite";
import { PathConverter } from "../../../util/path_converter";
import VideoItem from "../../browser/video_item";

const TagVideoList = (props: any) => {
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
        return <VideoItem href={`/tags/${props.tag_id}/video/${PathConverter.to_query(vid.path)}`} key={vid.name} vid={vid} />;
      })}
    </Box>
  );
};

export default observer(TagVideoList);
