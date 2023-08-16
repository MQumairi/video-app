import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { Tag } from "../../../api/agent";
import ITag from "../../../models/tag";
import TagsList from "../../tags/util/tags_list";
import { Box, Button } from "@mui/material";

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
    const res = await Tag.dynamic_playlists();
    if (res.status !== 200) return;
    set_tags(res.data);
  };
  useEffect(() => {
    fetch_tags();
  }, []);
  return (
    <div>
      <Button href="/tags/new" variant="contained" size="large">
        Create
      </Button>
      <Box component="div" sx={box_style}>
        <TagsList tags={tags} />
      </Box>
    </div>
  );
};

export default observer(PlaylistList);
