import VideoFileIcon from "@mui/icons-material/VideoFile";
import { Checkbox } from "@mui/material";
import { useEffect, useState } from "react";

export const CollectionEditVideoItem = (props: any) => {
  const [checked, set_checked] = useState<boolean>(false);
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

  const handle_change = (event: any) => {
    set_checked(!checked);
    console.log("checked ", props.vid);
    props.modify_set(props.vid);
  };

  useEffect(() => {
    if (props.check_all) {
      set_checked(true);
      props.modify_set(props.vid);
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
