import { observer } from "mobx-react-lite";
import IImageGallery from "../../../models/image_gallery";
import { useContext, useState } from "react";
import { Video } from "../../../api/agent";
import IImageMeta from "../../../models/image_meta";
import SelectedVideosStore from "../../../store/selected_videos_store";
import GalleryModal from "./gallery_modal";
import GalleryImages from "./gallery_images";

interface IProps {
  gallery: IImageGallery;
  viewer_height: number;
  thumb_id?: number;
}

const GalleryViewer = (props: IProps) => {
  const [selected_image, set_selected_image] = useState<IImageMeta | null>(null);
  const [selected_index, set_selected_index] = useState<number | null>(null);
  const [faved_image, set_faved_image] = useState<IImageMeta | null>(null);
  const [open_modal, set_open_modal] = useState<boolean>(false);
  const handle_open = () => set_open_modal(true);
  const handle_close = () => set_open_modal(false);

  const selectedVideoStore = useContext(SelectedVideosStore);

  const handle_thumb_set = async () => {
    const video = selectedVideoStore.running_video;
    if (!selected_image || !video) return;
    const res = await Video.thumb_video(video, selected_image);
    if (res.status === 200) {
      set_faved_image(selected_image);
    }
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
        viewer_height={props.viewer_height}
        set_selected_image={set_selected_image}
        set_selected_index={set_selected_index}
        handle_open={handle_open}
      />
    </div>
  );
};

export default observer(GalleryViewer);
