import { ButtonGroup } from "@mui/material";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Scripts } from "../../../api/agent";
import FunctionButton from "../../misc/function_button";
import HrefButton from "../../misc/href_button";
import IVideoScript from "../../../models/video_script";

const ScriptsDeletePage = () => {
  let script_id = useParams().script_id;
  const [script, set_script] = useState<IVideoScript | null>(null);

  const fetch_script = async () => {
    if (!script_id) {
      return;
    }
    let response: IVideoScript = (await Scripts.details(+script_id)).data;
    set_script(response);
  };

  const handle_script_delete = async () => {
    // window.location.replace(`/tags/`);
    if (script_id) {
      await Scripts.delete(+script_id);
    }
  };

  useEffect(() => {
    fetch_script();
  }, []);

  return (
    <div>
      <h1>Are you sure you want to delete the "{script?.name}" script?</h1>
      <ButtonGroup>
        <HrefButton href={"/scripts"} textContent="Back" />
        <FunctionButton fn={handle_script_delete} textContent="Delete" />
      </ButtonGroup>
    </div>
  );
};

export default observer(ScriptsDeletePage);
