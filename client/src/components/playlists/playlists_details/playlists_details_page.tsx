import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Playlist } from "../../../api/agent";
import IPlaylist from "../../../models/playlist";
import IVideoMeta from "../../../models/video_meta";
import { PathConverter } from "../../../util/path_converter";
import { HrefButton } from "../../misc/href_button";
import { PlaylistVideoList } from "./playlists_video_list";

export const PlaylistsDetailsPage = () => {
  let playlist_id = useParams().playlist_id ?? 1;
  const [playlist, set_playlist] = useState<IPlaylist | null>(null);
  const [random_vid, set_random_vid] = useState<IVideoMeta | null>(null);

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
      <HrefButton href={`/playlists/${playlist_id}/delete`} textContent={"Delete"} />
      {random_vid && <HrefButton textContent="Random" href={`/playlists/${playlist_id}/video/${PathConverter.to_query(random_vid.path)}`} />}
      <PlaylistVideoList playlist_id={playlist_id} videos={playlist?.videos} />
    </div>
  );
};
