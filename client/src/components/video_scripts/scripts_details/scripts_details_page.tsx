import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Scripts } from "../../../api/agent";
import HrefButton from "../../misc/href_button";
import BrowserResults from "../../browser/browser_results";
import IVideoScript from "../../../models/video_script";

const ScriptDetailsPage = () => {
  let script_id = useParams().script_id ?? 1;
  const [script, set_script] = useState<IVideoScript | null>(null);

  useEffect(() => {
    const fetch_script = async () => {
      let response: IVideoScript = (await Scripts.details(+script_id)).data;
      set_script(response);
    };
    fetch_script();
  }, []);

  return (
    <div>
      {script && <h1>Script: {script?.name}</h1>}
      <HrefButton href={`/scripts/${script_id}/delete`} textContent={"Delete"} />
      {script && <BrowserResults videos={script.videos} directories={[]} back_url={"/scripts"} />}
    </div>
  );
};

export default observer(ScriptDetailsPage);
