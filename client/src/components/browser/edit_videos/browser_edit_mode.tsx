import { Box } from "@mui/material";
import IVideoMeta from "../../../models/video_meta";
import { PathConverter } from "../../../util/path_converter";
import { TagVideoPopover } from "../../tags/tags_popover/tag_video_popover";
import { EditModeVideoItem } from "./edit_mode_video_item";

const checked_videos = new Set<IVideoMeta>();

export const BrowserEditMode = (props: any) => {
  const modify_set = (vid: IVideoMeta) => {
    console.log("called modify_set");
    if (checked_videos.has(vid) && !props.check_all) {
      console.log("deleting...");
      checked_videos.delete(vid);
      return;
    }
    console.log("adding...");
    checked_videos.add(vid);
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
        <TagVideoPopover toggle={props.tag_popover_visible} set_toggle={props.set_tag_popover_visible} videos={Array.from(checked_videos)} />
      )}
      <Box component="div" sx={box_style}>
        {props.video_paths?.map((vid: any) => {
          return (
            <EditModeVideoItem
              modify_set={modify_set}
              href={`/player/${PathConverter.to_query(vid.path)}`}
              vid={vid}
              key={vid.name}
              check_all={props.check_all}
            />
          );
        })}
      </Box>
    </div>
  );
};
