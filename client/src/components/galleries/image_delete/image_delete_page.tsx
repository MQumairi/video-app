import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import IImageMeta from "../../../models/image_meta";
import { Gallery, server_url } from "../../../api/agent";
import { PathConverter } from "../../../util/path_converter";
import { Button, Input } from "@mui/material";
import { useSearchParams } from "react-router-dom";

const ImageDeletePage = () => {
  let image_id = useParams().image_id;
  const [image, set_image] = useState<IImageMeta | null>(null);
  const [delete_input, set_delete_input] = useState<string>("");
  const [search_params] = useSearchParams({});

  const fetch_image = async () => {
    if (!image_id) return;
    const res = await Gallery.get_image(+image_id);
    if (res.status !== 200) return;
    set_image(res.data);
  };

  const handle_input_change = (event: any) => {
    set_delete_input(event.target.value);
  };

  const handle_delete = async () => {
    if (!image) return;
    await Gallery.delete_image(image);
  };

  useEffect(() => {
    fetch_image();
    // eslint-disable-next-line
  }, []);

  if (!image_id || !image) return <div>Loading Image...</div>;

  return (
    <div>
      <Button href={`/galleries/${image.gallery.id}?${search_params.toString()}`} variant="contained">
        Back
      </Button>
      <div>
        <h2>
          Delete image ({image.id}) of '{image.gallery.name}'
        </h2>
        <p>Type 'DELETE' below in order to delete this image</p>
        <Input style={{ backgroundColor: "white", color: "black" }} type="text" value={delete_input} onChange={handle_input_change} />
        <div>
          {delete_input === "DELETE" && (
            <Button variant="contained" color="error" onClick={handle_delete}>
              Delete
            </Button>
          )}
        </div>
      </div>
      <img
        src={`${server_url}/${PathConverter.remove_base(image.path)}`}
        srcSet={`${server_url}/${PathConverter.remove_base(image.path)}`}
        alt={image.id.toString()}
        loading="lazy"
        style={{ objectFit: "cover", width: "100%", height: "auto", marginTop: "20px" }}
      />
    </div>
  );
};

export default observer(ImageDeletePage);
