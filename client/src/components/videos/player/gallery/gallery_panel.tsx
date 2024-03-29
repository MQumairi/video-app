import { Button } from "@mui/material";
import GalleryViewer from "../../../galleries/details/gallery_viewer";
import { GalleryVariant } from "../../../../lib/gallery_utils";
import { useContext, useEffect } from "react";
import VideoStore from "../../../../store/video_store";
import { observer } from "mobx-react-lite";
import IImageMeta from "../../../../models/image_meta";
import { Video } from "../../../../api/agent";
import GenerateGallery from "./generate_gallery";

const GalleryPanel = () => {
  const video_store = useContext(VideoStore);
  const gallery = video_store.selected_video_gallery;

  const thumb_selected_image = async (image: IImageMeta): Promise<boolean> => {
    if (!video_store.selected_video) return false;
    const res = await Video.thumb_video(video_store.selected_video, image);
    return res.status === 200;
  };

  const lookup_gallery = async () => {
    if (!video_store.selected_video) return;
    try {
      const res = await Video.gallery(video_store.selected_video);
      if (res.status !== 200) return;
      video_store.set_selected_video_gallery(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    lookup_gallery();
    // eslint-disable-next-line
  }, []);

  if (!gallery)
    return (
      <div>
        <GenerateGallery />
      </div>
    );
  return (
    <div>
      <Button style={{ margin: "10px 0px 10px 0px" }} variant="contained" href={`/galleries/${gallery.id}`} target="_blank">
        Details
      </Button>
      <GalleryViewer set_thumb={thumb_selected_image} gallery={gallery} variant={GalleryVariant.Standard} viewer_height={600} />
    </div>
  );
};

export default observer(GalleryPanel);
