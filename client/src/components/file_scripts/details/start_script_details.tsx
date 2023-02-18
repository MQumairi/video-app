import { observer } from "mobx-react-lite";
import IFileScript from "../../../models/file_script";
import TagsDropdown from "../../tags/tag_popover/tag_dropdown";
import { useEffect, useState } from "react";
import { FileScripts } from "../../../api/agent";
import { Button } from "@mui/material";

interface IProps {
  script: IFileScript;
}

const StartScriptDetails = (props: IProps) => {
  const [selected_tag_id, set_selected_tag_id] = useState<number>(0);
  const [video_count, set_video_count] = useState<number>(0);
  const [image_count, set_image_count] = useState<number>(0);

  const on_tag_associate = async () => {
    console.log("selected tag:", selected_tag_id);
    const res = await FileScripts.associate_media_with_tag(props.script, selected_tag_id);
    console.log("res status", res.status);
    console.log(res.data);
  };

  const fetch_count = async () => {
    const res = await FileScripts.media_count(props.script);
    if (res.status != 200) return;
    set_video_count(res.data.videos);
    set_image_count(res.data.images);
  };

  useEffect(() => {
    fetch_count();
  }, []);

  return (
    <div>
      <div style={{ marginTop: "20px" }}>
        <p>Associate manual script '{props.script.name}', to all media with the selected tag</p>
        <div style={{ display: "flex", gap: "10px" }}>
          <TagsDropdown selected_tag_id={selected_tag_id} set_selected_tag_id={set_selected_tag_id} />
          <Button variant="contained" onClick={on_tag_associate}>
            Associate
          </Button>
        </div>
      </div>
      <div>Videos: {video_count}</div>
      <div>Images: {image_count}</div>
    </div>
  );
};

export default observer(StartScriptDetails);
