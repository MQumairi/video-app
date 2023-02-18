import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import IFileScript from "../../../models/file_script";
import { FileScripts } from "../../../api/agent";
import { Button, ButtonGroup } from "@mui/material";
import ManualScriptDetails from "./manual_script_details";
import GlobalScriptDetails from "./global_script_details";
import StartScriptDetails from "./start_script_details";
import ScriptTitle from "../script_title";


const FileScriptsDetails = () => {
  let script_id = useParams().script_id;
  const [script, set_script] = useState<IFileScript | undefined>(undefined);

  const fetch_script = async () => {
    if (!script_id) return;
    const res = await FileScripts.details(+script_id);
    if (res.status != 200) return;
    set_script(res.data);
  };

  useEffect(() => {
    fetch_script();
  }, []);

  if (!script) return <div>Script ({script_id}) not found</div>;

  return (
    <div>
      <ScriptTitle script={script}/>
      <ButtonGroup>
        <Button variant="contained" href="/file-scripts">
          Back
        </Button>
        <Button variant="contained" href={`/file-scripts/${script.id}/edit`}>
          Edit
        </Button>
      </ButtonGroup>
      <div style={{ marginTop: "20px" }}>
        {script.is_manual_script && <ManualScriptDetails script={script} />}
        {script.is_global_script && <GlobalScriptDetails script={script} />}
        {script.is_start_script && <StartScriptDetails script={script} />}
      </div>
    </div>
  );
};

export default observer(FileScriptsDetails);
