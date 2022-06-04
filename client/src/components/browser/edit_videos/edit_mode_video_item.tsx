import VideoFileIcon from "@mui/icons-material/VideoFile";
import { Checkbox } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import SelectedVideosStore from "../../../store/selected_videos_store";
import { observer } from "mobx-react-lite";

const EditModeVideoItem = (props: any) => {
  const [checked, set_checked] = useState<boolean>(false);
  const selectedVideoStore = useContext(SelectedVideosStore);

  const card_style = {
    margin: "30px",
    width: "100px",
    height: "auto",
    overflow: "hidden",
  };
  const icon_style = {
    width: "100px",
    height: "auto",
    textAlign: "center",
  };

  const checkbox_style = {
    color: "white",
    margin: "auto",
  };

  const handle_change = (_: any) => {
    if (!checked) {
      selectedVideoStore.add_selected_video(props.vid);
    } else {
      selectedVideoStore.remove_selected_video(props.vid);
    }
    set_checked(!checked);
  };

  useEffect(() => {
    if (props.check_all) {
      set_checked(true);
      selectedVideoStore.add_selected_video(props.vid);
    }
  });

  return (
    <div style={card_style}>
      <VideoFileIcon sx={icon_style} />
      <div>
        <Checkbox sx={checkbox_style} onChange={handle_change} checked={checked} />
      </div>
      <h4 style={{ textAlign: "center" }}>{props.vid.name}</h4>
    </div>
  );
};

export default observer(EditModeVideoItem);
