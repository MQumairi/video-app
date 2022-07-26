import { ButtonGroup } from "@mui/material";
import { useState } from "react";
import { observer } from "mobx-react-lite";
import IVideoMeta from "../../models/video_meta";
import HrefButton from "../misc/href_button";
import ToggleButton from "../misc/toggle_button";
import DirectoryVideos from "./directory_videos";
import BrowserEditMode from "./edit_videos/browser_edit_mode";
import SubDirectoryList from "./sub_directory_list";
import PlaylistPopoverButton from "../popovers/playlist_popover/playlist_popover_button";
import TagPopoverButton from "../tags/tag_popover/tag_popover_button";

interface IProps {
  directory_paths: string[];
  videos: IVideoMeta[];
  back_url: string;
}

const BrowserResults = (props: IProps) => {
  const [edit_mode, set_edit_mode] = useState<boolean>(false);
  const [check_all, set_check_all] = useState<boolean>(false);

  return (
    <div>
      <ButtonGroup>
        <HrefButton href={props.back_url} textContent="Back" />
        <ToggleButton toggle={edit_mode} set_toggle={set_edit_mode} trueText="Edit" />
        {edit_mode && <ToggleButton toggle={check_all} set_toggle={set_check_all} falseText="Check All" trueText="Unlock Check" />}
        {edit_mode && <TagPopoverButton />}
        {edit_mode && <PlaylistPopoverButton />}
      </ButtonGroup>
      {!edit_mode && props.directory_paths.length > 0 && <SubDirectoryList directory_paths={props.directory_paths} />}
      {!edit_mode && <DirectoryVideos video_paths={props.videos} />}
      {edit_mode && <BrowserEditMode video_paths={props.videos} check_all={check_all} />}
    </div>
  );
};

export default observer(BrowserResults);
