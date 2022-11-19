import { Chip } from "@mui/material";
import { observer } from "mobx-react-lite";
import { useContext, useState } from "react";
import { Tag } from "../../api/agent";
import ITag from "../../models/tag";
import SelectedVideosStore from "../../store/selected_videos_store";

interface IProps {
  tag: ITag;
}

const TagCapsule = (props: IProps) => {
  const selectedVideoStore = useContext(SelectedVideosStore);
  const [chip_display, set_chip_display] = useState<string>("");

  const handle_delete = async (event: any) => {
    console.log("entered handle delete");
    const video = selectedVideoStore.running_video;
    const updated_tag: ITag = {
      id: props.tag.id,
      name: props.tag.name,
      videos: [],
    };
    if (selectedVideoStore.selected_tag) {
      return await handle_child_tag_delete(updated_tag);
    }
    if (!video) return;
    updated_tag.videos = [video];
    await Tag.remove_video(updated_tag);
    set_chip_display("none");
  };

  const handle_child_tag_delete = async (tag_to_remove: ITag) => {
    console.log("handling child tag removal");
    const parent_tag = selectedVideoStore.selected_tag;
    if (!parent_tag) return;
    await Tag.remove_children(parent_tag, [tag_to_remove]);
  };

  return (
    <Chip
      sx={{ color: "white", fontSize: "16px", background: "#064669", margin: "5px", display: chip_display }}
      label={<a href={`/tags/${props.tag.id}`}>{props.tag.name}</a>}
      onDelete={handle_delete}
    />
  );
};

export default observer(TagCapsule);
