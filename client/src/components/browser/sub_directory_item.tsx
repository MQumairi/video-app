import FolderIcon from "@mui/icons-material/Folder";
import { PathConverter } from "../../util/path_converter";

export const SubDirectoryItem = (props: any) => {
  const card_style = {
    margin: "30px",
    width: "100px",
    height: "auto",
    overflow: "hidden",
    color: "white",
  };
  const icon_style = {
    width: "100px",
    height: "auto",
    textAlign: "center",
  };
  return (
    <a href={`/browser/${PathConverter.to_query(props.dir)}`} key={props.dir}>
      <div style={card_style}>
        <FolderIcon sx={icon_style} />
        <h4 style={{ textAlign: "center" }}>{PathConverter.get_base_name(props.dir)}</h4>
      </div>
    </a>
  );
};
