import { Button, ButtonGroup } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Playlist } from "../../../api/agent";
import IPlaylist from "../../../models/playlist";
import IVideoMeta from "../../../models/video_meta";
import { PathConverter } from "../../../util/path_converter";
import { observer } from "mobx-react-lite";
import VideoList from "../../videos/video_list";

const PlaylistsDetailsPage = () => {
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

  if (!playlist) return <h2>Loading playlist</h2>;

  return (
    <div>
      <div>
        <h1>{playlist.name}</h1>
        <h3>Playlist with {playlist.videos.length} items</h3>
      </div>
      <ButtonGroup sx={{ margin: "10px 0px 10px 0px" }} variant="contained" size="large">
        <Button href="/playlists">Back</Button>
        {random_vid && <Button href={`/playlists/${playlist_id}/video/${PathConverter.to_query(random_vid.path)}`}>Random</Button>}
        <Button href={`/playlists/${playlist_id}/delete`}>Delete</Button>
      </ButtonGroup>
      <VideoList base={`/playlists/${playlist_id}/video`} videos={playlist.videos} />
    </div>
  );
};

export default observer(PlaylistsDetailsPage);
