import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Directory } from "../../api/agent";
import IDirectory from "../../models/directory";
import { PathConverter } from "../../util/path_converter";
import { TextField } from "@mui/material";
import { BrowserResults } from "./browser_results";

const BrowserPage = () => {
  let dir_path = useParams().dir_path ?? "videos";
  const [directory, set_directory] = useState<IDirectory | null>(null);
  const [search_query, set_search_query] = useState<string>("");

  const fetch_directory = async (query: string) => {
    const api_query = PathConverter.to_query(query);
    const responded_directory: IDirectory = (await Directory.get(api_query)).data;
    set_directory(responded_directory);
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
    fetch_directory(dir_path);
  }, [dir_path]);

  return (
    <div>
      <h1>{directory?.name}</h1>
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
      {directory && (
        <BrowserResults
          back_url={PathConverter.to_query(directory.parent_path)}
          directory_paths={directory.directory_paths ?? []}
          videos={directory.video_paths ?? []}
        />
      )}
    </div>
  );
};

export default BrowserPage;
