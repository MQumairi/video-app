import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Directory } from "../../api/agent";
import IDirectory from "../../models/directory";
import { PathConverter } from "../../util/path_converter";
import BrowserResults from "./browser_results";
import IVideoMeta from "../../models/video_meta";
import { observer } from "mobx-react-lite";
import { FormGroup, TextField } from "@mui/material";

const BrowserPage = () => {
  let dir_path = useParams().dir_path;
  const [title, set_title] = useState<string>("");
  const [parent_page, set_parent_page] = useState<string>("");

  const [folder_directories, set_folder_directories] = useState<IDirectory[]>([]);
  const [folder_videos, set_folder_videos] = useState<IVideoMeta[]>([]);

  const [directories, set_directories] = useState<IDirectory[]>([]);
  const [videos, set_videos] = useState<IVideoMeta[]>([]);

  const [filter_text, set_filter_text] = useState<string>("");

  const fetch_data = async () => {
    await fetch_browser_data();
  };

  const fetch_browser_data = async () => {
    const api_query = PathConverter.to_query(dir_path ?? "videos");
    const response: IDirectory = await Directory.get(api_query);
    set_folder_directories(response.directory_paths ?? []);
    set_directories(response.directory_paths ?? []);
    set_folder_videos(response.video_paths ?? []);
    set_videos(response.video_paths ?? []);
    set_title(response.name);
    if (api_query === "videos") {
      set_parent_page("/browser/videos");
    } else {
      set_parent_page(PathConverter.to_query(response.parent_path));
    }
  };

  const handle_filter_text_change = async (event: any) => {
    const new_filter_text = event.target.value;
    set_filter_text(new_filter_text);
    // if text field goes back to empty, reset
    if (new_filter_text.length === 0) {
      set_directories(folder_directories);
      set_videos(folder_videos);
      return;
    }
    // otherwise filter
    const new_directories: IDirectory[] = [];
    for (const dir of folder_directories) {
      if (dir.name.toLowerCase().includes(new_filter_text.toLowerCase())) new_directories.push(dir);
    }
    set_directories(new_directories);
    const new_videos: IVideoMeta[] = [];
    for (const vid of folder_videos) {
      if (vid.name.toLowerCase().includes(new_filter_text.toLowerCase())) new_videos.push(vid);
    }
    set_videos(new_videos);
  };

  useEffect(() => {
    fetch_data();
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <h1>{title}</h1>
      <FormGroup row>
        <TextField sx={{ flexGrow: "100" }} variant="outlined" type="text" value={filter_text} onChange={handle_filter_text_change} label="Search" />
      </FormGroup>
      <BrowserResults back_url={parent_page} directories={directories} videos={videos} />
    </div>
  );
};

export default observer(BrowserPage);
