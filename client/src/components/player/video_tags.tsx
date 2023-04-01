import { observer } from "mobx-react-lite";
import TagCapsule from "../tags/util/tag_capsule";
import ITag from "../../models/tag";

interface IProps {
  tags: ITag[];
}

const VideoTags = (props: IProps) => {
  const video_tags = {
    background: "#01141f",
    display: "flex",
    flexWrap: "wrap" as "wrap",
    padding: "15px",
  };
  return (
    <div style={{ marginTop: "20px" }}>
      <div style={video_tags}>
        {props.tags?.map((tag: any) => {
          return <TagCapsule tag={tag} />;
        })}
      </div>
    </div>
  );
};

export default observer(VideoTags);
