import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import { Gallery } from "../../../api/agent";
import IImageGallery from "../../../models/image_gallery";
import { useEffect, useState } from "react";
import { Button, Input } from "@mui/material";
import { useSearchParams } from "react-router-dom";

const GalleryEditPage = () => {
  let gallery_id = useParams().gallery_id;
  const [gallery, set_gallery] = useState<IImageGallery | null>(null);
  const [delete_input, set_delete_input] = useState<string>("");
  const [search_params] = useSearchParams({});

  const handle_input_change = (event: any) => {
    set_delete_input(event.target.value);
  };

  const handle_delete = async () => {
    if (!gallery) return;
    console.log("deleting...");
    await Gallery.delete(gallery);
  };

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

  if (!gallery_id || !gallery) return <div>Gallery not found</div>;
  return (
    <div>
      <Button variant="contained" href={`/galleries/${gallery.id}/?${search_params.toString()}`}>
        Back
      </Button>
      <h2>Editing: {gallery.name}</h2>
      <p>Type 'DELETE' below in order to delete this gallery ({gallery.images.length} images)</p>
      <Input style={{ backgroundColor: "white", color: "black" }} type="text" value={delete_input} onChange={handle_input_change} />
      <div>
        {delete_input === "DELETE" && (
          <Button variant="contained" color="error" onClick={handle_delete}>
            Delete
          </Button>
        )}
      </div>
    </div>
  );
};

export default observer(GalleryEditPage);
