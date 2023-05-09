import { observer } from "mobx-react-lite";
import IVideoMeta from "../../../models/video_meta";
import { Chip, ImageListItem, ImageListItemBar, Stack } from "@mui/material";
import { calculate_duration, calculate_resolution, get_file_size_string } from "../../../lib/video_file_meta_calculator";
import MissingThumbnial from "../../misc/missing_thumbnial";
import Thumbnail from "../../misc/thumbnail";

interface IProps {
  video: IVideoMeta;
  url: string;
}

const VideoItem = (props: IProps) => (
  <a href={props.url} key={props.video.name}>
    <ImageListItem key={props.video.id}>
      {props.video.thumbnail && <Thumbnail image={props.video.thumbnail} />}
      {!props.video.thumbnail && <MissingThumbnial />}
      <ImageListItemBar style={{ height: "10%" }} title={props.video.name} position="below" />
      <Stack direction="row" spacing={1}>
        <Chip label={calculate_resolution(props.video)} color="primary" variant="outlined" />
        <Chip label={calculate_duration(props.video)} color="primary" variant="outlined" />
        <Chip label={get_file_size_string(props.video)} color="primary" variant="outlined" />
      </Stack>
    </ImageListItem>
  </a>
);

export default observer(VideoItem);
