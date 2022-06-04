import Button from "@mui/material/Button";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import SelectedVideosStore from "../../../store/selected_videos_store";

const PlaylistPopoverButton = (props: any) => {
  const selectedVideoStore = useContext(SelectedVideosStore);

  const handle_click = (event: any) => {
    selectedVideoStore.toggle_playlist_popover();
  };

  return (
    <Button variant="contained" onClick={handle_click} sx={{ marginTop: "20px" }}>
      Playlist
    </Button>
  );
};

export default observer(PlaylistPopoverButton);
