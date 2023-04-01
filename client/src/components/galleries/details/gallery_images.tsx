import { observer } from "mobx-react-lite";
import IImageMeta from "../../../models/image_meta";
import { Box, ImageList } from "@mui/material";
import GalleryImageThumb from "./gallery_image_thumb";

interface IProps {
  images: IImageMeta[];
  viewer_height: number;
  set_selected_image: (image: IImageMeta) => void;
  set_selected_index: (i: number) => void;
  handle_open: () => void;
}

const GalleryImages = (props: IProps) => {
  return (
    <Box sx={{ width: "100%", height: props.viewer_height, overflowY: "scroll" }}>
      <ImageList variant="masonry" cols={3} gap={8}>
        {props.images.map((image, index) => (
          <GalleryImageThumb
            image={image}
            onClick={() => {
              props.set_selected_image(image);
              props.set_selected_index(index);
              props.handle_open();
            }}
          />
        ))}
      </ImageList>
    </Box>
  );
};

export default observer(GalleryImages);
