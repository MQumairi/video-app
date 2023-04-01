import { observer } from "mobx-react-lite";
import IFileScript from "../../../models/file_script";
import { Chip } from "@mui/material";
import StartIcon from "@mui/icons-material/Start";
import PublicIcon from "@mui/icons-material/Public";
import PlumbingIcon from "@mui/icons-material/Plumbing";

interface IProps {
  script: IFileScript;
}
const FileScriptIndexRow = (props: IProps) => {
  const row_style = {
    backgroundColor: "#001f30",
    padding: "15px",
    marginTop: "10px",
    borderRadius: "10px",
    fontSize: "1.2em",
    color: "white",
    display: "flex",
    gap: "15px",
  };
  return (
    <a style={row_style} href={`/file-scripts/${props.script.id}`}>
      <Chip label={props.script.id} color="primary" />
      {props.script.is_start_script && <StartIcon fontSize="large" />}
      {props.script.is_manual_script && <PlumbingIcon fontSize="large" />}
      {props.script.is_global_script && <PublicIcon fontSize="large" />}
      {props.script.name}
    </a>
  );
};

export default observer(FileScriptIndexRow);
