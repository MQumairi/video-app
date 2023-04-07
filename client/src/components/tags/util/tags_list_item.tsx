import { observer } from "mobx-react-lite";
import ITag from "../../../models/tag";
import { Chip } from "@mui/material";

interface IProps {
  tag: ITag;
}

const TagsListItem = (props: IProps) => {
  return (
    <Chip sx={{ fontSize: "16px", background: "#064669", margin: "5px" }} key={props.tag.id} label={<a href={`/tags/${props.tag.id}`}>{props.tag.name}</a>} />
  );
};

export default observer(TagsListItem);
