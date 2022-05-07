import { useParams } from "react-router-dom";
import { PathConverter } from "../../util/path_converter";
import IVideoMeta from "../../models/video_meta";
import { Playlist, Tag, Video } from "../../api/agent";
import { useEffect, useState } from "react";
import { HrefButton } from "../misc/href_button";
import { ToggleButton } from "../misc/toggle_button";
import { VideoPlayer } from "./video_player";
import { TagVideoPopover } from "../tags/tags_popover/tag_video_popover";
import { VideoTags } from "./video_tags";

export const PlayerPage = () => {
  let vid_path = useParams().vid_path ?? "videos";
  let tag_id = useParams().tag_id;
  let playlist_id = useParams().playlist_id;

  const [video_meta, set_video_meta] = useState<IVideoMeta | null>(null);
  const [tag_toggled, set_tag_toggled] = useState<boolean>(false);
  const [random_vid_url, set_random_vid_url] = useState<string>("");

  const fetch_video_meta = async (query: string) => {
    const api_query = PathConverter.to_query(query);
    const received_video: IVideoMeta = (await Video.get(api_query)).data;
    set_video_meta(received_video);
    console.log(received_video);
  };

  const fetch_random_tag_video = async () => {
    if (tag_id) {
      let response: IVideoMeta = (await Tag.shuffle(+tag_id)).data;
      set_random_vid_url(`/tags/${tag_id}/video/${PathConverter.to_query(response.path)}`);
    } else if (playlist_id) {
      let response: IVideoMeta = (await Playlist.shuffle(+playlist_id)).data;
      set_random_vid_url(`/playlists/${playlist_id}/video/${PathConverter.to_query(response.path)}`);
    }
  };

  useEffect(() => {
    fetch_video_meta(vid_path);
    fetch_random_tag_video();
  }, []);

  const get_parent_path = () => {
    const query = (video_meta && PathConverter.to_query(video_meta.parent_path)) ?? "/";
    return `/browser/${query}`;
  };

  return (
    <div>
      <h1>{video_meta?.name}</h1>
      <HrefButton href={get_parent_path()} textContent="Back" />
      <ToggleButton toggle={tag_toggled} set_toggle={set_tag_toggled} trueText={"Tag"} />
      {random_vid_url != "" && <HrefButton textContent="Random" href={random_vid_url} />}
      {!tag_toggled && <VideoPlayer vid_path={vid_path} />}
      {tag_toggled && <TagVideoPopover toggle={tag_toggled} set_toggle={set_tag_toggled} videos={[video_meta]} />}
      <VideoTags tags={video_meta?.tags ?? []} />
    </div>
  );
};
