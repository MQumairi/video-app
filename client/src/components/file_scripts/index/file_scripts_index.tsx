import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import IFileScript from "../../../models/file_script";
import { FileScripts } from "../../../api/agent";
import FileScriptIndexRow from "./file_script_index_row";

const FileScriptsIndex = () => {
  const [scripts, set_scripts] = useState<IFileScript[]>([]);

  const fetch_scripts = async () => {
    const res = await FileScripts.get();
    if (res.status !== 200) return;
    set_scripts(res.data);
  };

  useEffect(() => {
    fetch_scripts();
  }, []);
  return (
    <div>
      <h1>File Scripts</h1>
      {scripts.map((s) => {
        return <FileScriptIndexRow script={s} />;
      })}
    </div>
  );
};

export default observer(FileScriptsIndex);
