import { observer } from "mobx-react-lite";
import ITag from "../../../models/tag";
import TagsListItem from "./tags_list_item";

interface IProps {
  tags: ITag[];
}

const TagsList = (props: IProps) => {
  return (
    <div>
      {props.tags.map((tag: any) => {
        return <TagsListItem tag={tag} />;
      })}
    </div>
  );
};

export default observer(TagsList);
