import FunctionButton from "../../misc/function_button";
import ToggleButton from "../../misc/toggle_button";
import ITag from "../../../models/tag";
import { useContext, useEffect, useState } from "react";
import { Tag } from "../../../api/agent";
import SelectedVideosStore from "../../../store/selected_videos_store";
import { observer } from "mobx-react-lite";
import TagSearcher from "./tags_searcher";
import IVideoMeta from "../../../models/video_meta";

let selected_tags: ITag[] = [];

const TagVideoPopover = (props: any) => {
  const selectedVideoStore = useContext(SelectedVideosStore);
  const [tags, set_tags] = useState<ITag[]>([]);

  const fetch_tags = async () => {
    let received_tags: ITag[] = (await Tag.get()).data;
    set_tags(received_tags);
  };

  const add_tag = (tag_name: string) => {
    const tag_to_add: ITag = {
      name: tag_name,
      id: 0,
      videos: [],
    };
    selected_tags.push(tag_to_add);
  };

  const send_video = async () => {
    const videos: IVideoMeta[] = selectedVideoStore.get_selected_videos();
    const tags: ITag[] = selected_tags;
    console.log("videos:", videos);
    console.log("tags:", tags);
    await Tag.tag_videos(videos, tags);
  };

  useEffect(() => {
    fetch_tags();
  }, []);

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
      <TagSearcher tags={tags} selected_tags={selected_tags} add_tag={add_tag} />
      <p>Associate the videos with the selected tag.</p>
      <ToggleButton toggle={selectedVideoStore.tag_popover_visible} set_toggle={selectedVideoStore.toggle_tag_popover} trueText="Cancel" />
      <FunctionButton fn={send_video} textContent="Submit" />
    </div>
  );
};

export default observer(TagVideoPopover);
