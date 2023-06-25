import { Grid } from "@mui/material";
import { PathConverter } from "../../../util/path_converter";
import VideoItem from "./video_item";
import { observer } from "mobx-react-lite";
import IVideoMeta from "../../../models/video_meta";

interface IProps {
  videos: IVideoMeta[];
  base: string;
  params?: string;
}

export const VideoList = (props: IProps) => {
  const video_item_url = (video: IVideoMeta): string => {
    console.log("video id:", video.id);
    let path = "";
    if (video.id) {
      path = `${props.base}/${video.id}`;
    } else {
      path = `${props.base}/${PathConverter.to_query(video.path)}`;
    }
    if (!props.params) return path;
    return `${path}?${props.params}`;
  };

  return (
    <Grid container spacing={{ xs: 1, md: 2, lg: 4 }} columns={{ xs: 1, sm: 2, md: 2, lg: 3, xl: 4 }}>
      {props.videos.map((vid) => (
        <Grid item xs={1} sm={1} md={1} lg={1} xl={1} key={vid.id}>
          <VideoItem url={video_item_url(vid)} video={vid} key={vid.id} />
        </Grid>
      ))}
    </Grid>
  );
};

export default observer(VideoList);
