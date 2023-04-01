import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import IVideoMeta from "../../models/video_meta";
import { Video } from "../../api/agent";
import ITag from "../../models/tag";
import VideoTags from "./video_tags";

interface IProps {
  video: IVideoMeta;
}

const TagsPanel = (props: IProps) => {
  const [tags, set_tags] = useState<ITag[]>([]);

  const fetch_scripts = async () => {
    const res = await Video.tags(props.video);
    if (res.status !== 200) return;
    set_tags(res.data);
  };

  useEffect(() => {
    fetch_scripts();
    // eslint-disable-next-line
  }, []);

  return <VideoTags tags={tags} />;
};

export default observer(TagsPanel);
