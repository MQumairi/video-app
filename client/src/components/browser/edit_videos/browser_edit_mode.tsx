import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import IVideoMeta from "../../../models/video_meta";
import { PathConverter } from "../../../util/path_converter";
import { EditModeVideoItem } from "./edit_mode_video_item";

export const BrowserEditMode = (props: any) => {
  const [checked_videos, set_checked_videos] = useState<Set<IVideoMeta>>(new Set<IVideoMeta>());

  const modify_set = (vid: IVideoMeta) => {
    let checked_videos_copy = new Set<IVideoMeta>(checked_videos);
    if (checked_videos_copy.has(vid)) {
      checked_videos_copy.delete(vid);
      set_checked_videos(checked_videos_copy);
      return;
    }
    checked_videos_copy.add(vid);
    set_checked_videos(checked_videos_copy);
    console.log("Set is now:", Array.from(checked_videos));
  };

  const box_style = {
    background: "#01141f",
    display: "flex",
    flexWrap: "wrap",
    padding: "15px",
    marginTop: "20px",
  };

  return (
    <div>
      <h2 style={{ marginTop: "20px" }}>Editing</h2>
      {props.tag_popover_visible && (
        <h1
          onClick={() => {
            alert("hello from " + checked_videos.size + " vids");
          }}
        >
          Tag these {checked_videos.size} videos?
        </h1>
      )}
      <Box component="div" sx={box_style}>
        {props.video_paths?.map((vid: any) => {
          return <EditModeVideoItem modify_set={modify_set} href={`/player/${PathConverter.to_query(vid.path)}`} vid={vid} key={vid.name} />;
        })}
      </Box>
    </div>
  );
};
