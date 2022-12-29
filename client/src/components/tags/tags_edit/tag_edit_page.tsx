import { observer } from "mobx-react-lite";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Tag } from "../../../api/agent";
import ITag from "../../../models/tag";
import SelectedVideosStore from "../../../store/selected_videos_store";
import HrefButton from "../../misc/href_button";
import VideoTags from "../../player/video_tags";
import TagVideoPopover from "../tag_popover/tag_video_popover";

const TagEditPage = () => {
  let tag_id = useParams().tag_id ?? 1;
  const [tag, set_tag] = useState<ITag | null>(null);

  const selectedVideoStore = useContext(SelectedVideosStore);

  useEffect(() => {
    const fetch_tag = async () => {
      let response: ITag = (await Tag.details(+tag_id)).data;
      set_tag(response);
      selectedVideoStore.set_single_tag_selection(response);
    };

    fetch_tag();
  }, []);

  return (
    <div>
      {tag && <h1>Editing Tag: {tag?.name}</h1>}
      {tag && <HrefButton href={`/tags/${tag_id}`} textContent={"Back"} />}
      <TagVideoPopover />
      {tag?.child_tags && <VideoTags tags={tag?.child_tags ?? []} />}
    </div>
  );
};

export default observer(TagEditPage);
