import FolderIcon from "@mui/icons-material/Folder";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PathConverter } from "../../util/path_converter";
import { observer } from "mobx-react-lite";
import IDirectory from "../../models/directory";

interface IProps {
  directory: IDirectory;
}

const SubDirectoryItem = (props: IProps) => {
  let url_query = useParams().query;

  const [sub_dir_url, set_sub_dir_url] = useState<string>("/");

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

  useEffect(() => {
    if (!url_query) {
      set_sub_dir_url(`/browser/${PathConverter.to_query(props.directory.path)}`);
    } else {
      set_sub_dir_url(`/browser/search/${url_query}/directory/${PathConverter.to_query(props.directory.path)}`);
    }
    // eslint-disable-next-line
  }, []);

  return (
    <a href={`${sub_dir_url}`} key={props.directory.path}>
      <div style={card_style}>
        <FolderIcon sx={icon_style} />
        <h4 style={{ textAlign: "center" }}>{PathConverter.get_base_name(props.directory.path)}</h4>
      </div>
    </a>
  );
};

export default observer(SubDirectoryItem);
