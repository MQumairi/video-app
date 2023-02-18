import { useState } from "react";
import IVideoMeta from "../../models/video_meta";
import { Button, Input } from "@mui/material";
import { observer } from "mobx-react-lite";
import { Video } from "../../api/agent";

interface IProps {
  video: IVideoMeta;
}

const DeleteVideoTab = (props: IProps) => {
  const [delete_input, set_delete_input] = useState<string>("");

  const handle_input_change = (event: any) => {
    set_delete_input(event.target.value);
  };

  const handle_delete = async () => {
    console.log("deleting...");
    await Video.delete(props.video);
  };

  return (
    <div>
      <h3>Confirm deletion of '{props.video.name}'</h3>
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
