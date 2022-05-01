import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Directory } from "../../api/agent";
import IDirectory from "../../models/directory";
import { PathConverter } from "../../util/path_converter";
import { DirectoryVideos } from "./directory_videos";
import { SubDirectoryList } from "./sub_directory_list";
import { HrefButton } from "../misc/href_button";
import { ToggleButton } from "../misc/toggle_button";
import { BrowserEditMode } from "./edit_videos/browser_edit_mode";

const BrowserPage = () => {
  let dir_path = useParams().dir_path ?? "videos";
  const [directory, set_directory] = useState<IDirectory | null>(null);
  const [edit_mode, set_edit_mode] = useState<boolean>(false);
  const [tag_popover_visible, set_tag_popover_visible] = useState<boolean>(false);

  const fetch_directory = async (query: string) => {
    const api_query = PathConverter.to_query(query);
    const responded_directory: IDirectory = (await Directory.get(api_query)).data;
    set_directory(responded_directory);
  };

  useEffect(() => {
    fetch_directory(dir_path);
  }, []);

  return (
    <div>
      <h1>{directory?.name}</h1>
      <HrefButton href={(directory && PathConverter.to_query(directory.parent_path)) ?? "data"} textContent="Back" />
      <ToggleButton toggle={edit_mode} set_toggle={set_edit_mode} textContent="Edit" />
      {edit_mode && <ToggleButton toggle={tag_popover_visible} set_toggle={set_tag_popover_visible} textContent="Tag" />}
      {!edit_mode && directory && <SubDirectoryList fetch_directory={fetch_directory} directory_paths={directory.directory_paths} />}
      {!edit_mode && directory && <DirectoryVideos video_paths={directory.video_paths} />}
      {edit_mode && directory && <BrowserEditMode video_paths={directory.video_paths} tag_popover_visible={tag_popover_visible} />}
    </div>
  );
};

export default BrowserPage;
