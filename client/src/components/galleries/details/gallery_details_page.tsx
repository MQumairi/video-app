import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import { Gallery } from "../../../api/agent";
import IImageGallery from "../../../models/image_gallery";
import { useEffect, useState } from "react";
import GalleryViewer from "./gallery_viewer";
import { Button, ButtonGroup, Chip, Stack } from "@mui/material";
import { useSearchParams } from "react-router-dom";

const GalleryDetailsPage = () => {
  let gallery_id = useParams().gallery_id;
  const [gallery, set_gallery] = useState<IImageGallery | null>(null);
  const [search_params] = useSearchParams({});

  const fetch_gallery = async () => {
    if (!gallery_id) return;
    const res = await Gallery.details(+gallery_id);
    console.log("feteched res:", res);
    if (res.status !== 200) return;
    const gallery: IImageGallery = res.data;
    console.log("feteched gallery:", gallery);
    set_gallery(gallery);
  };

  useEffect(() => {
    fetch_gallery();
    // eslint-disable-next-line
  }, []);

  if (!gallery_id || !gallery) return <div>Loading Gallery...</div>;
  return (
    <div>
      <h1>{gallery.name}</h1>
      <div>
        <Stack direction="row" spacing={1}>
          <Chip label={gallery.id} color="primary" variant="outlined" />
          <Chip label={`${gallery.images.length} images`} color="primary" variant="outlined" />
        </Stack>
      </div>
      <ButtonGroup style={{ margin: "10px 0px 10px 0px" }} variant="contained" aria-label="outlined primary button group">
        <Button variant="contained" href={`/galleries?${search_params.toString()}`}>
          Back
        </Button>
        <Button variant="contained" href={`/galleries/${gallery.id}/edit?${search_params.toString()}`}>
          Edit
        </Button>
      </ButtonGroup>
      <GalleryViewer gallery={gallery} viewer_height={800} />
    </div>
  );
};

export default observer(GalleryDetailsPage);
