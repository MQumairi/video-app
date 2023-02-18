import { Grid } from "@mui/material";
import { PathConverter } from "../../util/path_converter";
import VideoItem from "./video_item";
import { observer } from "mobx-react-lite";
import IVideoMeta from "../../models/video_meta";

interface IProps {
  videos: IVideoMeta[];
  base: string;
  params?: string;
}

export const DirectoryVideos = (props: IProps) => {
  const video_item_url = (video: IVideoMeta): string => {
    const path = `${props.base}/${PathConverter.to_query(video.path)}`;
    if (!props.params) return path;
    return `${path}?${props.params}`;
  };

  return (
    <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 2, sm: 4, md: 12 }}>
      {props.videos.map((vid) => (
        <Grid item xs={2} sm={4} md={4} key={vid.id}>
          <VideoItem url={video_item_url(vid)} video={vid} key={vid.id} />
        </Grid>
      ))}
    </Grid>
  );
};

export default observer(DirectoryVideos);
