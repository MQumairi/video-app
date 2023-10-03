import { observer } from "mobx-react-lite";
import IFileScript from "../../../models/file_script";
import { Button } from "@mui/material";
import { FileScripts } from "../../../api/agent";

interface IProps {
  script: IFileScript;
}

const GlobalScriptDetails = (props: IProps) => {
  const on_execute = async () => {
    console.log("executing", props.script.name);
    await FileScripts.execute_global_script(props.script, "");
  };

  return (
    <div>
      <div style={{ marginTop: "20px" }}>
        <p>Execute Global script '{props.script.name}'</p>
        <Button variant="contained" onClick={on_execute}>
          Execute
        </Button>
      </div>
    </div>
  );
};

export default observer(GlobalScriptDetails);
