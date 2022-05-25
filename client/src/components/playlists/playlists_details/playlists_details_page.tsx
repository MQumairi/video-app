import { ButtonGroup } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Playlist } from "../../../api/agent";
import IPlaylist from "../../../models/playlist";
import IVideoMeta from "../../../models/video_meta";
import { PathConverter } from "../../../util/path_converter";
import { HrefButton } from "../../misc/href_button";
import { ToggleButton } from "../../misc/toggle_button";
import { CollectionEditMode } from "../edit_video_collection/collection_edit_mode";
import { PlaylistVideoList } from "./playlists_video_list";

export const PlaylistsDetailsPage = () => {
  let playlist_id = useParams().playlist_id ?? 1;
  const [playlist, set_playlist] = useState<IPlaylist | null>(null);
  const [random_vid, set_random_vid] = useState<IVideoMeta | null>(null);

  const [edit_mode, set_edit_mode] = useState<boolean>(false);
  const [tag_popover_visible, set_tag_popover_visible] = useState<boolean>(false);
  const [playlist_popover_visible, set_playlist_popover_visible] = useState<boolean>(false);
  const [delete_mode_visible, set_delete_mode_visible] = useState<boolean>(false);
  const [check_all, set_check_all] = useState<boolean>(false);

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
        {edit_mode && <ToggleButton toggle={tag_popover_visible} set_toggle={set_tag_popover_visible} trueText="Tag" />}
        {edit_mode && <ToggleButton toggle={playlist_popover_visible} set_toggle={set_playlist_popover_visible} trueText="Playlist" />}
        {edit_mode && <ToggleButton toggle={delete_mode_visible} set_toggle={set_delete_mode_visible} trueText="Remove Videos" />}
        {!edit_mode && <HrefButton href={`/playlists/${playlist_id}/delete`} textContent={"Delete"} />}
        {!edit_mode && random_vid && <HrefButton textContent="Random" href={`/playlists/${playlist_id}/video/${PathConverter.to_query(random_vid.path)}`} />}
      </ButtonGroup>

      {!edit_mode && <PlaylistVideoList playlist_id={playlist_id} videos={playlist?.videos} />}

      {edit_mode && (
        <CollectionEditMode
          video_paths={playlist?.videos}
          tag_popover_visible={tag_popover_visible}
          set_tag_popover_visible={set_tag_popover_visible}
          playlist_popover_visible={playlist_popover_visible}
          set_playlist_popover_visible={set_playlist_popover_visible}
          delete_mode_visible={delete_mode_visible}
          set_delete_mode_visible={set_delete_mode_visible}
          check_all={check_all}
          collection_id={playlist_id}
        />
      )}
    </div>
  );
};
