import { MenuItem, Select } from "@mui/material";
import IVideoScript from "../../../models/video_script";
import { observer } from "mobx-react-lite";

interface IProps {
  scripts: IVideoScript[];
  selected_script: IVideoScript | null;
  set_selected_script: (id: IVideoScript) => void;
}

const ScriptsDropDown = (props: IProps) => {
  const selector_style = {
    background: "#064669",
    color: "white",
  };

  const handle_change = async (event: any) => {
    const script_id = event.target.value;
    for (let s of props.scripts) {
      if (s.id != script_id) continue;
      props.set_selected_script(s);
    }
  };

  return (
    <div>
      {props.scripts.length > 0 && (
        <Select
          defaultValue={""}
          sx={selector_style}
          labelId="scripts-dropdown"
          id="scripts-dropdown"
          label="scripts"
          value={props.selected_script?.id.toString() ?? "0"}
          onChange={handle_change}
        >
          {props.scripts.map((script) => {
            return (
              <MenuItem key={script.id} value={script.id}>
                {script.name}
              </MenuItem>
            );
          })}
        </Select>
      )}
    </div>
  );
};

export default observer(ScriptsDropDown);
