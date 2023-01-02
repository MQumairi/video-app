import { TableCell, TableRow } from "@mui/material";
import { observer } from "mobx-react-lite";
import IVideoScript from "../../../models/video_script";
import HrefButton from "../../misc/href_button";
import FunctionButton from "../../misc/function_button";
import { Scripts } from "../../../api/agent";

interface IProps {
  script: IVideoScript;
}

const ScriptsListRow = (props: IProps) => {
  const exec_script = async () => {
    await Scripts.execute(props.script.id, props.script.command + " ALL");
  };
  return (
    <TableRow key={props.script.id}>
      <TableCell style={{ color: "white" }}>{props.script.name}</TableCell>
      <TableCell style={{ color: "white" }}>{props.script.command}</TableCell>
      <TableCell style={{ color: "white" }}>{props.script.auto_exec_on_start ? "True" : "False"}</TableCell>
      <TableCell style={{ color: "white" }}>
        <HrefButton href={`/scripts/${props.script.id}`} textContent="Details" />
      </TableCell>
      <TableCell style={{ color: "white" }}>
        <FunctionButton fn={exec_script} textContent="Execute" />
      </TableCell>
    </TableRow>
  );
};

export default observer(ScriptsListRow);
