import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Directory } from "../../api/agent";
import IDirectory from "../../models/directory";
import { PathConverter } from "../../util/path_converter";
import { TextField } from "@mui/material";
import { BrowserResults } from "./browser_results";
import IVideoMeta from "../../models/video_meta";

const BrowserPage = () => {
  let dir_path = useParams().dir_path;
  let url_query = useParams().query;
  const [title, set_title] = useState<string>("");
  const [parent_page, set_parent_page] = useState<string>("");
  const [directories, set_directories] = useState<string[]>([]);
  const [videos, set_videos] = useState<IVideoMeta[]>([]);
  const [search_query, set_search_query] = useState<string>("");

  const fetch_data = async () => {
    if (!url_query) {
      await fetch_browser_data();
    } else if (url_query) {
      await fetch_search_data(url_query);
    }
  };

  const fetch_browser_data = async () => {
    const api_query = PathConverter.to_query(dir_path ?? "videos");
    const response: IDirectory = await Directory.get(api_query);
    set_directories(response.directory_paths ?? []);
    set_videos(response.video_paths ?? []);
    set_title(response.name);
    if (api_query == "videos") {
      set_parent_page("/browser/videos");
    } else {
      set_parent_page(PathConverter.to_query(response.parent_path));
    }
  };

  const fetch_search_data = async (url_query: string) => {
    const response = await Directory.search(url_query);
    set_directories(response.directories);
    set_videos(response.videos);
    set_title(url_query);
    set_parent_page(`${url_query}`);
  };

  const handle_change = (event: any) => {
    set_search_query(event.target.value);
  };

  const handle_submit = (event: any) => {
    if (event.key == "Enter") {
      window.location.replace(`/browser/search/${search_query}`);
    }
  };

  useEffect(() => {
    fetch_data();
  }, [dir_path, url_query]);

  return (
    <div>
      <h1>{title}</h1>
      <TextField
        InputProps={{ style: { color: "black", background: "white", height: "50px" } }}
        InputLabelProps={{ style: { color: "grey" } }}
        id="outlined-basic"
        label="Search"
        variant="filled"
        color="primary"
        fullWidth={true}
        value={search_query}
        onChange={handle_change}
        onKeyDown={handle_submit}
      />
      <BrowserResults back_url={parent_page} directory_paths={directories} videos={videos} />
    </div>
  );
};

export default BrowserPage;
