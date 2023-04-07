import { useContext, useState } from "react";
import IVideoMeta from "../../../models/video_meta";
import { Button, Input } from "@mui/material";
import { observer } from "mobx-react-lite";
import { Video } from "../../../api/agent";
import VideoStore from "../../../store/video_store";

const DeleteVideoTab = () => {
  const video_store = useContext(VideoStore);
  const [delete_input, set_delete_input] = useState<string>("");

  const handle_input_change = (event: any) => {
    set_delete_input(event.target.value);
  };

  const handle_delete = async () => {
    const video = video_store.selected_video;
    if (!video) return;
    console.log("deleting...");
    await Video.delete(video);
  };

  return (
    <div>
      <h3>Confirm deletion of '{video_store.selected_video?.name}'</h3>
      <p>Type 'DELETE' below</p>
      <Input style={{ backgroundColor: "white", color: "black" }} type="text" value={delete_input} onChange={handle_input_change} />
      <div>
        {delete_input === "DELETE" && (
          <Button variant="contained" color="error" onClick={handle_delete}>
            Delete
          </Button>
        )}
      </div>
    </div>
  );
};

export default observer(DeleteVideoTab);
