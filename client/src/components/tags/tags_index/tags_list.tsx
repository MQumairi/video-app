import { Box } from "@mui/material";
import { TagItem } from "./tag_item";

export const TagsList = (props: any) => {
  const box_style = {
    background: "#01141f",
    display: "flex",
    flexWrap: "wrap",
    padding: "15px",
    marginTop: "20px",
  };
  return (
    <Box component="div" sx={box_style}>
      {props.tags?.map((tag: any) => {
        return <TagItem key={tag.name} tag={tag}/>;
      })}
    </Box>
  );
};
