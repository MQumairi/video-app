import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Directory } from "../api/agent";
import IDirectory from "../models/directory";
import { PathConverter } from "../util/path_converter";
import { DirectoryVideos } from "./directory_videos";
import { SubDirectoryList } from "./sub_directory_list";

const BrowserPage = () => {
  let dir_path = useParams().dir_path ?? "data";
  const [directory, set_directory] = useState<IDirectory | null>(null);

  const fetch_directory = async (query: string) => {
    const api_query = PathConverter.to_query(query);
    const responded_directory: IDirectory = (await Directory.get(api_query)).data;
    set_directory(responded_directory);
  };

  const check_and_fetch = async () => {
    directory && (await fetch_directory(directory.parent_path));
  };

  useEffect(() => {
    fetch_directory(dir_path);
  }, []);

  return (
    <div>
      <h2>{directory?.path ?? "Nothing"}</h2>
      <b>Back Up: </b>
      <span
        onClick={async () => {
          await check_and_fetch();
        }}
      >
        Back
      </span>
      <h4>Sub Paths</h4>
      {directory && <SubDirectoryList fetch_directory={fetch_directory} directory_paths={directory.directory_paths} />}
      <h4>Videos</h4>
      {directory && <DirectoryVideos video_paths={directory.video_paths} />}
    </div>
  );
};

export default BrowserPage;
