import { ButtonGroup } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Playlist } from "../../../api/agent";
import IPlaylist from "../../../models/playlist";
import IVideoMeta from "../../../models/video_meta";
import { PathConverter } from "../../../util/path_converter";
import BrowserEditMode from "../../browser/edit_videos/browser_edit_mode";
import HrefButton from "../../misc/href_button";
import ToggleButton from "../../misc/toggle_button";
import PlaylistVideoList from "./playlists_video_list";
import SelectedVideosStore from "../../../store/selected_videos_store";
import { observer } from "mobx-react-lite";
import PlaylistPopoverButton from "../../popovers/playlist_popover/playlist_popover_button";
import TagPopoverButton from "../../tags/tag_popover/tag_popover_button";
import RemoveVideosPopoverButton from "../../popovers/remove_video_popover/remove_videos_popover_button";

const PlaylistsDetailsPage = () => {
  let playlist_id = useParams().playlist_id ?? 1;
  const [playlist, set_playlist] = useState<IPlaylist | null>(null);
  const [random_vid, set_random_vid] = useState<IVideoMeta | null>(null);
  const [edit_mode, set_edit_mode] = useState<boolean>(false);
  const [check_all, set_check_all] = useState<boolean>(false);

  const selectedVideoStore = useContext(SelectedVideosStore);

  const fetch_playlist = async () => {
    let response: IPlaylist = (await Playlist.details(+playlist_id)).data;
    set_playlist(response);
  };

  const fetch_random_playlist_video = async () => {
    let response: IVideoMeta = (await Playlist.shuffle(+playlist_id)).data;
    set_random_vid(response);
  };

  useEffect(() => {
    fetch_playlist();
    fetch_random_playlist_video();
  }, []);

  return (
    <div>
      {playlist && <h1>Playlist: {playlist?.name}</h1>}

      <ButtonGroup>
        <ToggleButton toggle={edit_mode} set_toggle={set_edit_mode} trueText="Edit" />
        {edit_mode && <ToggleButton toggle={check_all} set_toggle={set_check_all} falseText="Check All" trueText="Unlock Check" />}
        {edit_mode && <TagPopoverButton />}
        {edit_mode && <PlaylistPopoverButton />}
        {edit_mode && <RemoveVideosPopoverButton />}
        {!edit_mode && <HrefButton href={`/playlists/${playlist_id}/delete`} textContent={"Delete"} />}
        {!edit_mode && random_vid && <HrefButton textContent="Random" href={`/playlists/${playlist_id}/video/${PathConverter.to_query(random_vid.path)}`} />}
      </ButtonGroup>

      {!edit_mode && <PlaylistVideoList playlist_id={playlist_id} videos={playlist?.videos} />}

      {edit_mode && <BrowserEditMode video_paths={playlist?.videos} check_all={check_all} />}
    </div>
  );
};

export default observer(PlaylistsDetailsPage);
