import { observer } from "mobx-react-lite";
import IVideoMeta from "../../../models/video_meta";
import { Chip, ImageListItem, ImageListItemBar, Stack } from "@mui/material";
import { calculate_duration, calculate_resolution, get_file_size_string } from "../../../lib/video_file_meta_calculator";
import Thumbnail from "../../misc/thumbnail";
import { useSearchParams } from "react-router-dom";

interface IProps {
  video: IVideoMeta;
  url: string;
}

const VideoItem = (props: IProps) => {
  const [search_params] = useSearchParams({});

  const parmas_string = search_params.toString();
  const video_path = parmas_string.length > 0 ? `${props.url}?${parmas_string}` : props.url;
  return (
    <a href={video_path} key={props.video.name}>
      <ImageListItem key={props.video.id}>
        <Thumbnail image={props.video.thumbnail} />
        <ImageListItemBar style={{ height: "10%" }} title={props.video.name} position="below" />
        <Stack direction="row" spacing={1}>
          <Chip label={calculate_resolution(props.video)} color="primary" variant="outlined" />
          <Chip label={calculate_duration(props.video)} color="primary" variant="outlined" />
          <Chip label={get_file_size_string(props.video)} color="primary" variant="outlined" />
        </Stack>
      </ImageListItem>
    </a>
  );
};

export default observer(VideoItem);
