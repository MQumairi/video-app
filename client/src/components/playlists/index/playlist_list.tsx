import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { Playlist } from "../../../api/agent";
import ITag from "../../../models/tag";
import { Box, Button, Chip } from "@mui/material";

const PlaylistList = () => {
  const box_style = {
    background: "#01141f",
    display: "flex",
    flexWrap: "wrap",
    padding: "15px",
    marginTop: "20px",
  };

  const [tags, set_tags] = useState<ITag[]>([]);
  const fetch_tags = async () => {
    const res = await Playlist.get();
    if (res.status !== 200) return;
    set_tags(res.data);
  };
  useEffect(() => {
    fetch_tags();
  }, []);
  return (
    <div>
      <Button href="/playlists/new" variant="contained" size="large">
        Create
      </Button>
      <Box component="div" sx={box_style}>
        {tags.map((tag: any) => {
          return <Chip sx={{ fontSize: "16px", background: "#064669", margin: "5px" }} key={tag.id} label={<a href={`/playlists/${tag.id}`}>{tag.name}</a>} />;
        })}
      </Box>
    </div>
  );
};

export default observer(PlaylistList);
