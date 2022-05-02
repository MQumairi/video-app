import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Video } from "../../../api/agent";
import IVideoMeta from "../../../models/video_meta";
import { PathConverter } from "../../../util/path_converter";
import { HrefButton } from "../../misc/href_button";
import { ToggleButton } from "../../misc/toggle_button";
import { VideoPlayer } from "../../player/video_player";
import { VideoTags } from "../../player/video_tags";
import { TagVideoPopover } from "../tags_popover/tag_video_popover";

export const TagVideoPage = () => {
  let vid_path = useParams().vid_path!;
  let tag_id = useParams().id ?? 1;

  const [video_meta, set_video_meta] = useState<IVideoMeta | null>(null);
  const [tag_toggled, set_tag_toggled] = useState<boolean>(false);

  const fetch_video_meta = async (query: string) => {
    const api_query = PathConverter.to_query(query);
    const responded_directory: IVideoMeta = (await Video.get(api_query)).data;
    set_video_meta(responded_directory);
  };

  useEffect(() => {
    fetch_video_meta(vid_path);
  }, []);

  return (
    <div>
      <h1>{video_meta?.name}</h1>
      <HrefButton href={`/tags/${tag_id}`} textContent="Back" />
      <ToggleButton toggle={tag_toggled} set_toggle={set_tag_toggled} trueText={"Tag"} />
      {!tag_toggled && <VideoPlayer vid_path={vid_path} />}
      {tag_toggled && <TagVideoPopover toggle={tag_toggled} set_toggle={set_tag_toggled} videos={[video_meta]} />}
      <VideoTags tags={video_meta?.tags ?? []} />
    </div>
  );
};
