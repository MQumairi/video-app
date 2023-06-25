import { observer } from "mobx-react-lite";
import IVideoMeta from "../../../models/video_meta";
import { Video } from "../../../api/agent";
import HomePageSegment from "./home_page_segment";

const HomePage = () => {
  const get_popular_videos = async (): Promise<IVideoMeta[]> => {
    const res_latest = await Video.popular();
    if (res_latest.status !== 200) return [];
    return res_latest.data;
  };

  const get_discover_videos = async (): Promise<IVideoMeta[]> => {
    const res_latest = await Video.discover();
    if (res_latest.status !== 200) return [];
    return res_latest.data;
  };

  const get_latest_videos = async (): Promise<IVideoMeta[]> => {
    const res_latest = await Video.latest();
    if (res_latest.status !== 200) return [];
    return res_latest.data;
  };


  return (
    <div>
      <HomePageSegment title="Popular" video_fetcher={get_popular_videos} />
      <HomePageSegment title="Discover" video_fetcher={get_discover_videos} />
      <HomePageSegment title="Latest" video_fetcher={get_latest_videos} />
    </div>
  );
};

export default observer(HomePage);
