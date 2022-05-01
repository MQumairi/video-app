import { useState } from "react";
import { Tag } from "../../../api/agent";
import IVideoMeta from "../../../models/video_meta";
import { HrefButton } from "../../misc/href_button";
import { SubmitButton } from "../../misc/submit_button";

export const TagsCreatePage = () => {
  const [tag_name, set_tag_name] = useState("");
  const handle_change = (input: any) => {
    set_tag_name(input.target.value);
  };
  const on_submit = async (input: any) => {
    const video_object: IVideoMeta = {
      name: tag_name,
      path: "",
      parent_path: "",
    };
    await Tag.post(video_object);
  };
  return (
    <div>
      <h1>New Tag </h1>
      <HrefButton href="/tags" textContent="Back" />
      <form onSubmit={on_submit}>
        <label>
          Name:
          <input type="text" name="name" value={tag_name} onChange={handle_change} />
        </label>
        <SubmitButton />
      </form>
    </div>
  );
};
