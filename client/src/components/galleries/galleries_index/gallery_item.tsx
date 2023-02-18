import { observer } from "mobx-react-lite";
import { Chip, ImageListItem, ImageListItemBar, Stack } from "@mui/material";
import IImageGallery from "../../../models/image_gallery";
import MissingThumbnial from "../../misc/missing_thumbnial";
import { server_url } from "../../../api/agent";
import { PathConverter } from "../../../util/path_converter";

interface IProps {
  gallery: IImageGallery;
  url: string;
}

const GalleryItem = (props: IProps) => (
  <a href={props.url} key={props.gallery.name}>
    <ImageListItem key={props.gallery.id}>
      {props.gallery.thumbnail && (
        <img
          src={`${server_url}/${PathConverter.remove_base(props.gallery.thumbnail.path)}`}
          srcSet={`${server_url}/${PathConverter.remove_base(props.gallery.thumbnail.path)}`}
          alt={props.gallery.name}
          loading="lazy"
          style={{ objectFit: "cover", height: "90%" }}
        />
      )}
      {!props.gallery.thumbnail && <MissingThumbnial />}
      <ImageListItemBar style={{ height: "10%" }} title={props.gallery.name} position="below" />
      <Stack direction="row" spacing={1}>
        <Chip label={props.gallery.id} color="primary" variant="outlined" />
        <Chip label={props.gallery.images.length} color="primary" variant="outlined" />
      </Stack>
    </ImageListItem>
  </a>
);

export default observer(GalleryItem);
