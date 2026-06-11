import { observer } from "mobx-react-lite";
import IVideoMeta from "../../../models/video_meta";
import { Chip, ImageListItem, ImageListItemBar, Stack } from "@mui/material";
import { calculate_duration, calculate_resolution, get_file_size_string, calc_video_value } from "../../../lib/video_file_meta_calculator";
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
    <a href={video_path} key={props.video.name} style={{ display: "block" }}>
      <ImageListItem
        key={props.video.id}
        sx={{
          position: 'relative', // Make sure the hover effect is relative to this container
          width: '100%',
          '&:hover .top-bar': {
            opacity: 1, // Show the top bar on hover
          },
        }}
      >
        {/* Top ImageListItemBar with hover effect */}
        <ImageListItemBar
          className="top-bar"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            opacity: 0, // Initially hide the top bar
            transition: 'opacity 0.3s ease', // Add transition for smooth fade-in
          }}
          title={`Rating ${props.video.rating}/10`}
          subtitle={`Score ${calc_video_value(props.video.rating_size_value)}`}
          position="top"
        />
        <Thumbnail image={props.video.thumbnail} />
        {/* Bottom ImageListItemBar */}
        <ImageListItemBar
          sx={{ height: '10%' }}
          title={props.video.name}
          position="below"
        />
        {/* lineHeight is reset here because ImageListItem sets line-height:0 (to remove
            the inline gap under tiled images), which otherwise collapses the chip labels
            to zero height and clips their text — making the metadata appear blank. */}
        <Stack direction="row" spacing={1} sx={{ lineHeight: "normal", mt: 1, flexWrap: "wrap", rowGap: 1 }}>
          <Chip label={calculate_resolution(props.video)} color="primary" variant="outlined" />
          <Chip label={calculate_duration(props.video)} color="primary" variant="outlined" />
          <Chip label={get_file_size_string(props.video)} color="primary" variant="outlined" />
        </Stack>
      </ImageListItem>
    </a>
  );
};

export default observer(VideoItem);
