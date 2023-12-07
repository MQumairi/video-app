import { Button, FormGroup, TextField } from "@mui/material";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Playlist, Tag } from "../../../api/agent";
import ITag from "../../../models/tag";
import { IPlaylist } from "../../../models/playlist";

const DeletePage = () => {
  let playlist_id = useParams().playlist_id;
  const [playlist, set_playlist] = useState<IPlaylist | null>(null);
  const [delete_input, set_delete_input] = useState<string>("");
  const [delete_success, set_delete_success] = useState<boolean>(false);

  const fetch_tag = async () => {
    if (!playlist_id) return;
    let res = await Playlist.details(+playlist_id);
    if (res.status !== 200) return;
    set_playlist(res.data.playlist);
  };

  const handle_delete_input_change = (event: any) => {
    set_delete_input(event.target.value);
  };

  const handle_tag_delete = async () => {
    if (!playlist) return;
    const res = await Playlist.delete(playlist);
    if (res.status !== 200) return;
    set_delete_input("");
    set_delete_success(true);
  };

  useEffect(() => {
    fetch_tag();
    // eslint-disable-next-line
  }, []);

  if (!playlist)
    return (
      <div>
        <Button href={`/playlists?tags_index_tab=0`} variant="contained">
          Back
        </Button>
        <h2 style={{ marginTop: "20px" }}>Playlist {playlist_id} not found</h2>
      </div>
    );

  if (delete_success)
    return (
      <div>
        <h2>Successfully deleted playlist "{playlist.name}"</h2>
        <Button variant="contained" size="large" color="success" href="/playlists">
          Done
        </Button>
      </div>
    );

  return (
    <div>
      <Button href={`/playlists/${playlist.id}`} variant="contained">
        Back
      </Button>
      <h2 style={{ marginTop: "10px" }}>Are you sure you want to delete the "{playlist.name}" playlist?</h2>
      <FormGroup sx={{ marginTop: "20px", gap: "10px" }}>
        <TextField label="Type 'DELETE' in order to proceed with delete" value={delete_input} onChange={handle_delete_input_change} />
        {delete_input === "DELETE" && (
          <Button variant="contained" size="large" color="error" onClick={handle_tag_delete}>
            Delete
          </Button>
        )}
      </FormGroup>
    </div>
  );
};

export default observer(DeletePage);
