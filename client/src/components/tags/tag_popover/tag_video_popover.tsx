import FunctionButton from "../../misc/function_button";
import ToggleButton from "../../misc/toggle_button";
import ITag from "../../../models/tag";
import TagDropDown from "./tag_dropdown";
import { useContext, useEffect, useState } from "react";
import { Tag } from "../../../api/agent";
import SelectedVideosStore from "../../../store/selected_videos_store";
import { observer } from "mobx-react-lite";
import TagSearcher from "./tags_searcher";
import IVideoMeta from "../../../models/video_meta";
import { toJS } from "mobx";

let selected_tags: ITag[] = [];

const TagVideoPopover = (props: any) => {
  const [selected_tag_id, set_selected_tag_id] = useState<number>(1);
  const selectedVideoStore = useContext(SelectedVideosStore);
  const [tags, set_tags] = useState<ITag[]>([]);

  const fetch_tags = async () => {
    let received_tags: ITag[] = (await Tag.get()).data;
    set_tags(received_tags);
  };

  const add_tag = (tag_name: string) => {
    const videos: IVideoMeta[] = [];
    for (const v of Array.from(selectedVideoStore.selected_videos.values())) {
      videos.push(toJS(v));
    }
    const tag_to_add: ITag = {
      name: tag_name,
      id: 0,
      videos: videos,
    };
    console.log("adding tag: ", tag_to_add);
    selected_tags.push(tag_to_add);
    console.log("selected tags:", selected_tags);
  };

  const send_video = async () => {
    console.log("sending", selected_tags.length, "tags.");
    for (const t of selected_tags) {
      await Tag.add_video(t);
    }
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
