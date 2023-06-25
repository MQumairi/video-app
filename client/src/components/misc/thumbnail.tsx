import { observer } from "mobx-react-lite";
import IImageMeta from "../../models/image_meta";
import { server_url } from "../../api/agent";
import { PathConverter } from "../../util/path_converter";

interface IProps {
  image: IImageMeta;
}
const Thumbnail = (props: IProps) => {
  const image_url = `${server_url}/${PathConverter.remove_base(props.image.path)}`;

  const thumb_height = "230px";

  const vertical_container = {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    overflow: "hidden",
    height: thumb_height,
  };

  const container_style = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    height: thumb_height,
  };

  if (props.image.height > props.image.width) {
    return (
      <div style={vertical_container}>
        <img
          src={`${image_url}`}
          srcSet={`${image_url}`}
          alt={`Vertical ${props.image.id.toString()}`}
          loading="lazy"
          style={{ objectFit: "cover", objectPosition: "0 0", flexShrink: 0, width: "100%", height: "100%" }}
        />
      </div>
    );
  }

  return (
    <div style={container_style}>
      <img
        src={`${image_url}`}
        srcSet={`${image_url}`}
        alt={`Horizontal ${props.image.id.toString()}`}
        loading="lazy"
        style={{ objectFit: "cover", flexShrink: 0, width: "100%", height: "100%" }}
      />
    </div>
  );
};

export default observer(Thumbnail);
