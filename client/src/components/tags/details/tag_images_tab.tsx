import { observer } from "mobx-react-lite";
import GalleryViewer from "../../galleries/details/gallery_viewer";
import IImageGallery from "../../../models/image_gallery";
import { useEffect, useState } from "react";
import ITag from "../../../models/tag";
import { Tag } from "../../../api/agent";
import { Button } from "@mui/material";
import { GalleryVariant } from "../../../lib/gallery_utils";

interface IProps {
  tag: ITag;
}

const TagImagesTab = (props: IProps) => {
  const [tag_temp_gallery, set_tag_temp_gallery] = useState<IImageGallery | undefined>(undefined);

  const lookup_tag_images = async () => {
    const image_res = await Tag.random_images(props.tag);
    if (image_res.status !== 200) return;
    const temp_gallery: IImageGallery = {
      id: 0,
      images: image_res.data,
      name: props.tag.name,
    };
    set_tag_temp_gallery(temp_gallery);
  };

  useEffect(() => {
    lookup_tag_images();
    // eslint-disable-next-line
  }, []);

  if (!tag_temp_gallery || tag_temp_gallery.images.length === 0) return <h2>No images associated with "{props.tag.name}"</h2>;
  return (
    <div>
      <Button onClick={lookup_tag_images}>Reload</Button>
      <GalleryViewer gallery={tag_temp_gallery} variant={GalleryVariant.Masonary} viewer_height={800} />
    </div>
  );
};

export default observer(TagImagesTab);
