import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import IVideoMeta from "../../../models/video_meta";
import { Video } from "../../../api/agent";
import HomePageSegment from "./home_page_segment";

const HomePage = () => {
  const [latest_videos, set_latest_videos] = useState<IVideoMeta[]>([]);
  const [popular_videos, set_populat_videos] = useState<IVideoMeta[]>([]);
  const [discover_videos, set_discover_videos] = useState<IVideoMeta[]>([]);

  const lookup_video_lists = async () => {
    const res_latest = await Video.latest();
    if (res_latest.status !== 200) return;
    set_latest_videos(res_latest.data);

    const res_popular = await Video.popular();
    if (res_popular.status !== 200) return;
    set_populat_videos(res_popular.data);

    const res_discover = await Video.discover();
    if (res_discover.status !== 200) return;
    set_discover_videos(res_discover.data);
  };

  useEffect(() => {
    lookup_video_lists();
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <HomePageSegment title="Popular" videos={popular_videos} />
      <HomePageSegment title="Latest" videos={latest_videos} />
      <HomePageSegment title="Discover" videos={discover_videos} />
    </div>
  );
};

export default observer(HomePage);
