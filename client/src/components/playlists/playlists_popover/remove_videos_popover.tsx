import { useState } from "react";
import { FunctionButton } from "../../misc/function_button";
import { ToggleButton } from "../../misc/toggle_button";

export const RemoveVideosPopover = (props: any) => {
  const delete_videos = async (event: any) => {
    console.log(props.videos);
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
      <h2>Remove {props.videos.length} Videos from this Collection?</h2>
      <FunctionButton fn={delete_videos} textContent="Yes" />
      <ToggleButton toggle={props.toggle} set_toggle={props.set_toggle} trueText="Cancel" />
    </div>
  );
};
