import { Box } from "@mui/material";
import SubDirectoryItem from "./sub_directory_item";
import { observer } from "mobx-react-lite";
import IDirectory from "../../models/directory";

interface IProps {
  directories: IDirectory[]
}

const SubDirectoryList = (props: IProps) => {
  const box_style = {
    background: "#01141f",
    display: "flex",
    flexWrap: "wrap",
    padding: "15px",
    marginTop: "20px",
  };
  return (
    <Box component="div" sx={box_style}>
      {props.directories.map((dir) => {
        return <SubDirectoryItem directory={dir} key={dir.path} />;
      })}
    </Box>
  );
};

export default observer(SubDirectoryList);
