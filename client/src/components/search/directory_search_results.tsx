import { ButtonGroup, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Directory } from "../../api/agent";
import IDirectorySearchResult from "../../models/directory_search_result";
import { DirectoryVideos } from "../browser/directory_videos";
import { BrowserEditMode } from "../browser/edit_videos/browser_edit_mode";
import { SubDirectoryList } from "../browser/sub_directory_list";
import { ToggleButton } from "../misc/toggle_button";

export const DirectorySearchResults = () => {
  let query = useParams().query ?? "";
  const [search_results, set_search_results] = useState<IDirectorySearchResult | null>(null);
  const [search_query, set_search_query] = useState<string>("");
  const [edit_mode, set_edit_mode] = useState<boolean>(false);
  const [tag_popover_visible, set_tag_popover_visible] = useState<boolean>(false);
  const [check_all, set_check_all] = useState<boolean>(false);

  const fetch_directory_search_result = async () => {
    console.log("fetching results...");
    const responded_directory = await Directory.search(query);
    console.log("response is:", responded_directory);
    console.log("results are:", responded_directory);
    set_search_results(responded_directory.data);
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
    console.log("use effect started");
    fetch_directory_search_result();
  }, []);

  return (
    <div>
      <h1>{search_results?.query}</h1>
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
      <ButtonGroup>
        <ToggleButton toggle={edit_mode} set_toggle={set_edit_mode} trueText="Edit" />
        {edit_mode && <ToggleButton toggle={check_all} set_toggle={set_check_all} falseText="Check All" trueText="Unlock Check" />}
        {edit_mode && <ToggleButton toggle={tag_popover_visible} set_toggle={set_tag_popover_visible} trueText="Tag" />}
      </ButtonGroup>
      {!edit_mode && search_results && <SubDirectoryList fetch_directory={fetch_directory_search_result} directory_paths={search_results.directories} />}
      {!edit_mode && search_results && <DirectoryVideos video_paths={search_results.videos} />}
      {edit_mode && search_results && (
        <BrowserEditMode
          video_paths={search_results.videos}
          tag_popover_visible={tag_popover_visible}
          set_tag_popover_visible={set_tag_popover_visible}
          check_all={check_all}
        />
      )}
    </div>
  );
};
