import { Box } from "@mui/material";
import { SubDirectoryItem } from "./sub_directory_item";

export const SubDirectoryList = (props: any) => {
  const box_style = {
    background: "#01141f",
    display: "flex",
    padding: "15px",
    marginTop: "20px",
  };
  return (
    <Box component="div" sx={box_style}>
      {props.directory_paths.map((dir: string) => {
        return <SubDirectoryItem dir={dir} fetch_directory={props.fetch_directory} />;
      })}
    </Box>
  );
};
