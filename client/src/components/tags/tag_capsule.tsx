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
    const video = selectedVideoStore.running_video;
    if (!video) return;
    const updated_tag: ITag = {
      id: props.tag.id,
      name: props.tag.name,
      videos: [video],
    };
    await Tag.remove_video(updated_tag);
    set_chip_display("none");
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
