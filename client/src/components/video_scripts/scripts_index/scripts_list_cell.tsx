import { Box } from "@mui/material";
import { observer } from "mobx-react-lite";
import IVideoScript from "../../../models/video_script";

interface IProps {
  script: IVideoScript;
}

const ScriptsListCell = (props: IProps) => {
  const box_style = {
    background: "#01141f",
    padding: "15px",
    marginTop: "20px",
  };
  return <Box component="div" sx={box_style}></Box>;
};

export default observer(ScriptsListCell);
