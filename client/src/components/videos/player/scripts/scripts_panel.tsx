import { observer } from "mobx-react-lite";
import { useContext, useEffect } from "react";
import VideoScriptRow from "./video_script_row";
import VideoStore from "../../../../store/video_store";

const ScriptsPanel = () => {
  const video_store = useContext(VideoStore);
  const video = video_store.selected_video;

  useEffect(() => {
    video_store.lookup_selected_video_scripts();
    // eslint-disable-next-line
  }, []);

  if (!video || video_store.selected_video_scripts.length === 0)
    return (
      <div>
        <h2>No scripts associated with this video</h2>
      </div>
    );

  return (
    <div>
      {video_store.selected_video_scripts.map((s) => {
        return <VideoScriptRow script={s} video={video} />;
      })}
    </div>
  );
};

export default observer(ScriptsPanel);
