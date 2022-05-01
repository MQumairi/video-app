import { FunctionButton } from "../../misc/function_button";
import { ToggleButton } from "../../misc/toggle_button";
import ITag from "../../../models/tag";
import { TagDropDown } from "./tag_dropdown";
import { useState } from "react";
import { Tag } from "../../../api/agent";

export const TagVideoPopover = (props: any) => {
  const [selected_tag_id, set_selected_tag_id] = useState<number>(1);

  const style = {
    background: "red",
    width: "500px",
    height: "min-content",
    padding: "20px",
    margin: "auto",
  };

  const send_video = async () => {
    const video_meta = props.video;
    const updated_tag: ITag = {
      id: selected_tag_id,
      name: "",
      videos: [video_meta],
    };
    await Tag.add_video(updated_tag);
  };

  return (
    <div style={style}>
      <TagDropDown selected_tag_id={selected_tag_id} set_selected_tag_id={set_selected_tag_id} />
      <h1>TAG POPOVER</h1>
      <h1>TAG POPOVER</h1>
      <h1>TAG POPOVER</h1>
      <ToggleButton toggle={props.toggle} set_toggle={props.set_toggle} textContent="Cancel" />
      <FunctionButton fn={send_video} textContent="Submit" />
    </div>
  );
};
