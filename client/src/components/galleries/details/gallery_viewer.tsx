import { observer } from "mobx-react-lite";
import IImageGallery from "../../../models/image_gallery";
import { useState } from "react";
import IImageMeta from "../../../models/image_meta";
import GalleryModal from "./gallery_modal";
import GalleryImages from "./gallery_images";
import { GalleryVariant } from "../../../lib/gallery_utils";

interface IProps {
  gallery: IImageGallery;
  variant: GalleryVariant;
  viewer_height: number;
  thumb_id?: number;
  set_thumb?: (image: IImageMeta) => Promise<boolean>;
}

const GalleryViewer = (props: IProps) => {
  const [selected_image, set_selected_image] = useState<IImageMeta | null>(null);
  const [selected_index, set_selected_index] = useState<number | null>(null);
  const [, set_faved_image] = useState<IImageMeta | null>(null);
  const [open_modal, set_open_modal] = useState<boolean>(false);
  const handle_open = () => set_open_modal(true);
  const handle_close = () => set_open_modal(false);

  const handle_thumb_set = async () => {
    if (!props.set_thumb || !selected_image) return;
    const set_success = await props.set_thumb(selected_image);
    if (!set_success) return;
    set_faved_image(selected_image);
  };

  const next_image = () => {
    console.log("entered next image");
    console.log("selected index:", selected_index);
    if (selected_index === null || selected_index >= props.gallery.images.length) return;
    set_selected_index(selected_index + 1);
    set_selected_image(props.gallery.images[selected_index]);
    console.log("selected index:", selected_index);
  };

  const prev_image = () => {
    console.log("entered prev image");
    console.log("selected index:", selected_index);
    if (selected_index === null || selected_index <= 0) return;
    set_selected_index(selected_index - 1);
    set_selected_image(props.gallery.images[selected_index]);
    console.log("selected index:", selected_index);
  };

  return (
    <div>
      {selected_image && (
        <GalleryModal
          image={selected_image}
          gallery_id={props.gallery.id}
          open_modal={open_modal}
          handle_close={handle_close}
          handle_thumb_set={handle_thumb_set}
          is_thumb={props.thumb_id !== undefined && props.thumb_id === selected_image.id}
          next={next_image}
          back={prev_image}
        />
      )}
      <GalleryImages
        images={props.gallery.images}
        variant={props.variant}
        viewer_height={props.viewer_height}
        set_selected_image={set_selected_image}
        set_selected_index={set_selected_index}
        handle_open={handle_open}
      />
    </div>
  );
};

export default observer(GalleryViewer);
