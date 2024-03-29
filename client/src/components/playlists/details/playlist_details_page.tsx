import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Playlist } from "../../../api/agent";
import { Button, ButtonGroup, Chip, Stack } from "@mui/material";
import { Subscriptions } from "@mui/icons-material";
import IPersistentQuery from "../../../models/persistent_query";
import DynamicPlaylistQueries from "../../tags/dynamic_playlist/dynamic_playlisy_queries";
import { IPlaylist } from "../../../models/playlist";

const PlayListDetailsPage = () => {
  let playlist_id = useParams().playlist_id ?? 1;
  const [playlist, set_playlist] = useState<IPlaylist | null>(null);
  const [playlist_queries, set_playlist_queries] = useState<IPersistentQuery[]>([]);

  const fetch_tag = async () => {
    const res = await Playlist.details(+playlist_id);
    if (res.status !== 200) return;
    const fetched_playlist: IPlaylist = res.data.playlist;
    set_playlist(fetched_playlist);
    set_playlist_queries(res.data.queries);
  };

  useEffect(() => {
    fetch_tag();
    // eslint-disable-next-line
  }, []);

  if (!playlist) return <h2>Loading Tag...</h2>;

  return (
    <div>
      <Stack direction="row" spacing={1}>
        <Subscriptions fontSize="large" />
        <h2>{playlist.name}</h2>
      </Stack>
      <Stack direction="row" spacing={1}>
        <Chip size="small" variant="outlined" label={playlist.id} color="primary" />
      </Stack>
      <ButtonGroup sx={{ margin: "10px 0px 10px 0px" }} variant="contained" size="large">
        <Button href={`/playlists?tags_index_tab=0`}>Back</Button>
        <Button href={`/playlists/${playlist_id}/order/${1}`}>Play</Button>
        <Button href={`/playlists/${playlist_id}/edit`}>Edit</Button>
        <Button href={`/playlists/${playlist_id}/delete`}>Delete</Button>
      </ButtonGroup>
      <DynamicPlaylistQueries queries={playlist_queries} tag_id={playlist.id} />
    </div>
  );
};

export default observer(PlayListDetailsPage);
