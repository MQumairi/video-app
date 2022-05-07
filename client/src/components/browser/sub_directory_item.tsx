import FolderIcon from "@mui/icons-material/Folder";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PathConverter } from "../../util/path_converter";

export const SubDirectoryItem = (props: any) => {
  let dir_path = useParams().dir_path;
  let url_query = useParams().query;

  const [sub_dir_url, set_sub_dir_url] = useState<string>("/");

  // <Route path="browser/search/:query/directory/:dir_path" element={<BrowserPage />} />
  // <Route path="browser/:dir_path" element={<BrowserPage />} />
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
      set_sub_dir_url(`/browser/${PathConverter.to_query(props.dir)}`);
    } else {
      set_sub_dir_url(`/browser/search/${url_query}/directory/${PathConverter.to_query(props.dir)}`);
    }
  }, []);

  return (
    <a href={`${sub_dir_url}`} key={props.dir}>
      <div style={card_style}>
        <FolderIcon sx={icon_style} />
        <h4 style={{ textAlign: "center" }}>{PathConverter.get_base_name(props.dir)}</h4>
      </div>
    </a>
  );
};
