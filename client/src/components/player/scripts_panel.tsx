import { observer } from "mobx-react-lite";
import IFileScript from "../../models/file_script";
import { useEffect, useState } from "react";
import IVideoMeta from "../../models/video_meta";
import { Video } from "../../api/agent";
import VideoScriptRow from "./video_script_row";

interface IProps {
  video: IVideoMeta;
}

const ScriptsPanel = (props: IProps) => {
  const [scripts, set_scripts] = useState<IFileScript[]>([]);

  const fetch_scripts = async () => {
    const res = await Video.scripts(props.video);
    if (res.status !== 200) return;
    set_scripts(res.data);
  };

  useEffect(() => {
    fetch_scripts();
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      {scripts.map((s) => {
        return <VideoScriptRow script={s} video={props.video} />;
      })}
    </div>
  );
};

export default observer(ScriptsPanel);
