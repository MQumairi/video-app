import { observer } from "mobx-react-lite";
import TagCapsule from "../tags/util/tag_capsule";
import ITag from "../../models/tag";

interface IProps {
  tags: ITag[];
}

const VideoTags = (props: IProps) => {
  return (
    <div>
      {props.tags?.map((tag: any) => {
        return <TagCapsule tag={tag} />;
      })}
    </div>
  );
};

export default observer(VideoTags);
