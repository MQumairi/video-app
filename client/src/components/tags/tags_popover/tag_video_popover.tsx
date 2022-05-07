import { FunctionButton } from "../../misc/function_button";
import { ToggleButton } from "../../misc/toggle_button";
import ITag from "../../../models/tag";
import { TagDropDown } from "./tag_dropdown";
import { useState } from "react";
import { Tag } from "../../../api/agent";

export const TagVideoPopover = (props: any) => {
  const [selected_tag_id, set_selected_tag_id] = useState<number>(1);

  const style = {
    background: "#022a40",
    width: "500px",
    height: "min-content",
    padding: "20px",
    margin: "auto",
  };

  const send_video = async () => {
    const videos = props.videos;
    console.log("videos are", videos);
    const updated_tag: ITag = {
      id: selected_tag_id,
      name: "",
      videos: videos,
    };
    await Tag.add_video(updated_tag);
  };

  return (
    <div style={style}>
      <h2>Add Tag</h2>
      <TagDropDown selected_tag_id={selected_tag_id} set_selected_tag_id={set_selected_tag_id} />
      <p>Associate the videos with the selected tag.</p>
      <ToggleButton toggle={props.toggle} set_toggle={props.set_toggle} trueText="Cancel" />
      <FunctionButton fn={send_video} textContent="Submit" />
    </div>
  );
};
