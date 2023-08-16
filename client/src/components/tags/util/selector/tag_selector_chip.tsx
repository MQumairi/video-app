import ITag from "../../../../models/tag";
import { Chip } from "@mui/material";
import { observer } from "mobx-react-lite";

interface IProps {
  tag: ITag;
  remove_tag: (tag: ITag) => void;
}

const TagSelectorChip = (props: IProps) => {
  return (
    <Chip
      sx={{ marginLeft: "5px", marginTop: "5px" }}
      key={props.tag.name}
      label={props.tag.name}
      onDelete={() => {
        props.remove_tag(props.tag);
      }}
    />
  );
};

export default observer(TagSelectorChip);
