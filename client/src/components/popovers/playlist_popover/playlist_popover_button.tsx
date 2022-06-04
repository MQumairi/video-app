import Button from "@mui/material/Button";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import SelectedVideosStore from "../../../store/selected_videos_store";

const PlaylistPopoverButton = (props: any) => {
  const selectedVideoStore = useContext(SelectedVideosStore);

  const handle_click = (event: any) => {
    console.log("clicked on playlistpopover button");
    selectedVideoStore.toggle_playlist_popover();
    console.log("Playlist should be visible:", selectedVideoStore.playlist_popover_visible);
  };

  return (
    <Button variant="contained" onClick={handle_click} sx={{ marginTop: "20px" }}>
      Playlist
    </Button>
  );
};

export default observer(PlaylistPopoverButton);
