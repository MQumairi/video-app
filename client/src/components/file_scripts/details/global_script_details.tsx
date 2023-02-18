import { observer } from "mobx-react-lite";
import IFileScript from "../../../models/file_script";
import PublicIcon from "@mui/icons-material/Public";

interface IProps {
  script: IFileScript;
}

const GlobalScriptDetails = (props: IProps) => (
  <div>
    <PublicIcon fontSize="large" />
  </div>
);

export default observer(GlobalScriptDetails);
