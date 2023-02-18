import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Scripts } from "../../../api/agent";
import HrefButton from "../../misc/href_button";
import BrowserResults from "../../browser/browser_results";
import IVideoScript from "../../../models/video_script";
import { FormControlLabel, Switch } from "@mui/material";

const ScriptDetailsPage = () => {
  let script_id = useParams().script_id ?? 1;
  const [script, set_script] = useState<IVideoScript | null>(null);

  const handle_start_script_toggle = (event: any) => {
    if (!script) return;
    console.log("before:", script);
    let updated_auto_start = !script.auto_exec_on_start;
    let updated_script: IVideoScript = { ...script };
    updated_script.auto_exec_on_start = updated_auto_start;
    console.log("mid:", updated_script);
    set_script(updated_script);
    Scripts.edit(script.id, script.command, script.auto_exec_on_start);
    console.log("after:", updated_script);
  };

  useEffect(() => {
    const fetch_script = async () => {
      let response: IVideoScript = await (await Scripts.details(+script_id)).data;
      set_script(response);
    };
    fetch_script();
  }, []);

  return (
    <div>
      {script && <h1>Script: {script?.name}</h1>}
      <HrefButton href={`/scripts/${script_id}/delete`} textContent={"Delete"} />
      {script && (
        <FormControlLabel
          control={<Switch defaultChecked checked={script.auto_exec_on_start} onChange={handle_start_script_toggle} />}
          label="Is Start Script"
        />
      )}
      {script && <BrowserResults videos={script.videos} directories={[]} back_url={"/scripts"} />}
    </div>
  );
};

export default observer(ScriptDetailsPage);
