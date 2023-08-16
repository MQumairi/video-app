import { observer } from "mobx-react-lite";
import PlaylistTabs from "./playlist_tabs";

const PlaylistIndex = () => {
  return (
    <div>
      <PlaylistTabs />
    </div>
  );
};

export default observer(PlaylistIndex);
