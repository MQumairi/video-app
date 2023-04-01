import { observer } from "mobx-react-lite";
import IVideoMeta from "../../models/video_meta";
import { server_url } from "../../api/agent";
import { PathConverter } from "../../util/path_converter";
import { Chip, ImageListItem, ImageListItemBar, Stack } from "@mui/material";
import { calculate_duration, calculate_resolution } from "../../lib/video_file_meta_calculator";
import MissingThumbnial from "../misc/missing_thumbnial";

interface IProps {
  video: IVideoMeta;
  url: string;
}

const VideoItem = (props: IProps) => (
  <a href={props.url} key={props.video.name}>
    <ImageListItem key={props.video.id}>
      {props.video.thumbnail && (
        <img
          src={`${server_url}/${PathConverter.remove_base(props.video.thumbnail.path)}`}
          srcSet={`${server_url}/${PathConverter.remove_base(props.video.thumbnail.path)}`}
          alt={props.video.name}
          loading="lazy"
          style={{ objectFit: "cover", height: "90%" }}
        />
      )}
      {!props.video.thumbnail && <MissingThumbnial />}
      <ImageListItemBar style={{ height: "10%" }} title={props.video.name} position="below" />
      <Stack direction="row" spacing={1}>
        <Chip label={calculate_resolution(props.video)} color="primary" variant="outlined" />
        <Chip label={calculate_duration(props.video)} color="primary" variant="outlined" />
      </Stack>
    </ImageListItem>
  </a>
);

export default observer(VideoItem);
