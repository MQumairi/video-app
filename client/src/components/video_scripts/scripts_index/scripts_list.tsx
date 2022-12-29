import { Box } from "@mui/material";
import { observer } from "mobx-react-lite";
import IVideoScript from "../../../models/video_script";
import ScriptsListRow from "./scripts_list_row";

interface IProps {
  scripts: IVideoScript[];
}

const ScriptsList = (props: IProps) => {
  const box_style = {
    background: "#01141f",
    padding: "15px",
    marginTop: "20px",
  };
  return (
    <Box component="div" sx={box_style}>
      {props.scripts.map((script) => {
        return <ScriptsListRow script={script} />;
      })}
    </Box>
  );
};

export default observer(ScriptsList);
