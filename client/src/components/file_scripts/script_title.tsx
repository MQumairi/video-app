import IFileScript from "../../models/file_script";
import StartIcon from "@mui/icons-material/Start";
import PublicIcon from "@mui/icons-material/Public";
import PlumbingIcon from "@mui/icons-material/Plumbing";
import { observer } from "mobx-react-lite";

interface IProps {
  script: IFileScript;
}

const ScriptTitle = (props: IProps) => {
  return (
    <h1>
      {props.script.is_start_script && <StartIcon fontSize="large" />}
      {props.script.is_manual_script && <PlumbingIcon fontSize="large" />}
      {props.script.is_global_script && <PublicIcon fontSize="large" />}
      {props.script.name}
    </h1>
  );
};

export default observer(ScriptTitle)
