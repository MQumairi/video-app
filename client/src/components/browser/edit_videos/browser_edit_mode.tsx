import { Box } from "@mui/material";
import { PathConverter } from "../../../util/path_converter";
import { EditModeVideoItem } from "./edit_mode_video_item";

export const BrowserEditMode = (props: any) => {
  const box_style = {
    background: "#01141f",
    display: "flex",
    flexWrap: "wrap",
    padding: "15px",
    marginTop: "20px",
  };

  return (
    <div>
      <h2 style={{ marginTop: "20px" }}>Editing</h2>
      <Box component="div" sx={box_style}>
        {props.video_paths?.map((vid: any) => {
          return <EditModeVideoItem href={`/player/${PathConverter.to_query(vid.path)}`} vid={vid} key={vid.name} />;
        })}
      </Box>
    </div>
  );
};
