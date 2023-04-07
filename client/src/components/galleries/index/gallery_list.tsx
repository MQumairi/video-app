import { observer } from "mobx-react-lite";
import IImageGallery from "../../../models/image_gallery";
import { Grid } from "@mui/material";
import GalleryItem from "./gallery_item";
import { useSearchParams } from "react-router-dom";

interface IProps {
  galleries: IImageGallery[];
}

const GalleryList = (props: IProps) => {
  const [search_params] = useSearchParams({});

  return (
    <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 2, sm: 4, md: 12 }}>
      {props.galleries.length > 0 &&
        props.galleries.map((gallery) => {
          return (
            <Grid item xs={2} sm={4} md={4} key={gallery.id}>
              <GalleryItem gallery={gallery} url={`/galleries/${gallery.id}?${search_params.toString()}`} />
            </Grid>
          );
        })}
    </Grid>
  );
};

export default observer(GalleryList);
