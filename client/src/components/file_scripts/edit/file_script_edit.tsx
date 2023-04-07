import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import IFileScript from "../../../models/file_script";
import { FileScripts } from "../../../api/agent";
import { Button, FormControl, FormControlLabel, Radio, RadioGroup } from "@mui/material";

const FileScriptsEdit = () => {
  let script_id = useParams().script_id;
  const [script, set_script] = useState<IFileScript | undefined>(undefined);
  const [script_type, set_script_type] = useState<string>("manual");

  const fetch_script = async () => {
    if (!script_id) return;
    const res = await FileScripts.details(+script_id);
    if (res.status !== 200) return;
    set_script(res.data);
    if (!script) return;
    if (script.is_manual_script) set_script_type("manual");
    if (script.is_global_script) set_script_type("global");
    if (script.is_start_script) set_script_type("start");
  };

  useEffect(() => {
    fetch_script();
    // eslint-disable-next-line
  }, []);

  if (!script) return <div>Script ({script_id}) not found</div>;

  const get_script_type = (): string => {
    if (script.is_start_script) return "start";
    if (script.is_global_script) return "global";
    return "manual";
  };

  const handle_script_type_change = (event: any) => {
    set_script_type(event.target.value);
  };

  const handle_submit = async () => {
    if (!script) return;
    const edited_script = script;
    if (script_type === "start") edited_script.is_start_script = true;
    else if (script_type === "global") edited_script.is_global_script = true;
    else if (script_type === "manual") edited_script.is_manual_script = true;
    await FileScripts.edit(edited_script);
  };

  return (
    <div>
      <h1>Edit: "{script.name}"</h1>
      <Button variant="contained" href={`/file-scripts/${script.id}`}>
        Back
      </Button>
      <div style={{ marginTop: "20px", color: "white" }}>
        <FormControl>
          <h2>Script Type</h2>
          <RadioGroup
            row
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue={get_script_type()}
            value={script_type}
            onChange={(e) => {
              handle_script_type_change(e);
            }}
            name="radio-buttons-group"
          >
            <FormControlLabel value="manual" control={<Radio />} label="Manual" />
            <FormControlLabel value="start" control={<Radio />} label="Start" />
            <FormControlLabel value="global" control={<Radio />} label="Global" />
          </RadioGroup>
          <Button
            variant="contained"
            onClick={async () => {
              await handle_submit();
            }}
          >
            Submit
          </Button>
        </FormControl>
      </div>
    </div>
  );
};

export default observer(FileScriptsEdit);
