import { observer } from "mobx-react-lite";
import { server_url } from "../../../api/agent";
import IImageMeta from "../../../models/image_meta";
import { PathConverter } from "../../../util/path_converter";
import { seconds_to_duration } from "../../../lib/video_file_meta_calculator";
import { ImageListItem, ImageListItemBar } from "@mui/material";

interface IProps {
  image: IImageMeta;
  onClick: () => void;
}

const GalleryImageThumb = (props: IProps) => {
  const timestamp = (): string => {
    if (!props.image.timestamp_secs) return "";
    return seconds_to_duration(props.image.timestamp_secs);
  };

  return (
    <ImageListItem key={props.image.id} onClick={props.onClick}>
      <img
        src={`${server_url}/${PathConverter.remove_base(props.image.path)}`}
        srcSet={`${server_url}/${PathConverter.remove_base(props.image.path)}`}
        alt={props.image.id.toString()}
        loading="lazy"
        style={{ objectFit: "cover", height: "90%" }}
      />
      {props.image.timestamp_secs && <ImageListItemBar style={{ height: "10%" }} title={timestamp()} position="bottom" />}
    </ImageListItem>
  );
};

export default observer(GalleryImageThumb);
