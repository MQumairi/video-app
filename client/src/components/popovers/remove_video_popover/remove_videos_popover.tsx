import FunctionButton from "../../misc/function_button";
import ToggleButton from "../../misc/toggle_button";
import { Playlist } from "../../../api/agent";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import SelectedVideosStore from "../../../store/selected_videos_store";

const RemoveVideosPopover = (props: any) => {
  const selectedVideoStore = useContext(SelectedVideosStore);

  const delete_videos = async (event: any) => {
    const videos = Array.from(selectedVideoStore.selected_videos);
    console.log("videos are", videos);
    const updated_video_collection = {
      id: props.collection_id,
      name: "",
      videos: videos,
    };
    await Playlist.remove_video(updated_video_collection);
    window.location.reload();
  };

  const style = {
    background: "#022a40",
    width: "500px",
    height: "min-content",
    padding: "20px",
    margin: "auto",
  };

  return (
    <div style={style}>
      <h2>Remove {selectedVideoStore.selected_videos.size} Videos from this Collection?</h2>
      <FunctionButton fn={delete_videos} textContent="Yes" />
      <ToggleButton toggle={props.toggle} set_toggle={props.set_toggle} trueText="Cancel" />
    </div>
  );
};

export default observer(RemoveVideosPopover);
