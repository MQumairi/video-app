import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Tag } from "../../../api/agent";
import IVideoMeta from "../../../models/video_meta";
import FunctionButton from "../../misc/function_button";
import HrefButton from "../../misc/href_button";

const TagsCreatePage = () => {
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
    console.log("sending: ", video_object);
    const response = await Tag.post(video_object);
    console.log(response);
    set_tag_name("");
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
        <FunctionButton textContent="Submit" fn={on_submit} />
      </form>
    </div>
  );
};

export default observer(TagsCreatePage);
