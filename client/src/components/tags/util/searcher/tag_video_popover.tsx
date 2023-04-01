import FunctionButton from "../../../misc/function_button";
import ToggleButton from "../../../misc/toggle_button";
import ITag from "../../../../models/tag";
import { useContext, useState } from "react";
import { Tag } from "../../../../api/agent";
import SelectedVideosStore from "../../../../store/selected_videos_store";
import { observer } from "mobx-react-lite";
import TagSearcher from "./tag_searcher";
import IVideoMeta from "../../../../models/video_meta";

const TagVideoPopover = (props: any) => {
  const [selected_tags, set_selected_tags] = useState<ITag[]>([]);
  const selectedVideoStore = useContext(SelectedVideosStore);

  const send_video = async () => {
    if (selectedVideoStore.selected_tag) {
      console.log("sending child tags");
      return await send_tag();
    }
    const videos: IVideoMeta[] = selectedVideoStore.get_selected_videos();
    console.log("videos:", videos);
    await Tag.tag_videos(videos, selected_tags);
  };

  const send_tag = async () => {
    const parent_tag = selectedVideoStore.selected_tag;
    if (!parent_tag) return;
    await Tag.add_children(parent_tag, selected_tags);
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
      <h2>Add Tag</h2>
      <TagSearcher selected_tags={selected_tags} set_selected_tags={set_selected_tags} />
      <p>Associate the videos with the selected tag.</p>
      <ToggleButton toggle={selectedVideoStore.tag_popover_visible} set_toggle={selectedVideoStore.toggle_tag_popover} trueText="Cancel" />
      <FunctionButton fn={send_video} textContent="Submit" />
    </div>
  );
};

export default observer(TagVideoPopover);
