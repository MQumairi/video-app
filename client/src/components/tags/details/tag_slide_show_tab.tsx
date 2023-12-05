import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import ITag from "../../../models/tag";
import { Tag, server_url } from "../../../api/agent";
import IImageMeta from "../../../models/image_meta";
import { PathConverter } from "../../../util/path_converter";

interface IProps {
  tag: ITag;
}

const TagSlideshowTab = (props: IProps) => {
  const [slide_image, set_slide_image] = useState<IImageMeta | undefined>(undefined);

  const lookup_tag_image = async () => {
    try {
      const image_res = await Tag.random_image_single(props.tag);
      if (image_res.status !== 200) return;
      const image = image_res.data;
      set_slide_image(image);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    lookup_tag_image();
    // eslint-disable-next-line
  }, []);

  if (!slide_image) return <h2>No slides associated with "{props.tag.name}"</h2>;
  return (
    <div>
      <img
        src={`${server_url}/${PathConverter.remove_base(slide_image.path)}`}
        srcSet={`${server_url}/${PathConverter.remove_base(slide_image.path)}`}
        alt={slide_image.id.toString()}
        loading="lazy"
        style={{ objectFit: "cover", width: "100%", height: "auto", marginTop: "20px" }}
        onClick={lookup_tag_image}
      />
    </div>
  );
};

export default observer(TagSlideshowTab);
