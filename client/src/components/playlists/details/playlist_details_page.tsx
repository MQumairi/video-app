import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Tag } from "../../../api/agent";
import ITag from "../../../models/tag";
import { Button, ButtonGroup, Chip, Stack } from "@mui/material";
import { Subscriptions } from "@mui/icons-material";
import IPersistentQuery from "../../../models/persistent_query";
import DynamicPlaylistQueries from "../../tags/dynamic_playlist/dynamic_playlisy_queries";

const PlayListDetailsPage = () => {
  let tag_id = useParams().tag_id ?? 1;
  const [tag, set_tag] = useState<ITag | null>(null);
  const [playlist_queries, set_playlist_queries] = useState<IPersistentQuery[]>([]);

  const fetch_tag = async () => {
    const res = await Tag.details(+tag_id);
    if (res.status !== 200) return;
    const fetched_tag: ITag = res.data.tag;
    if (!fetched_tag.is_dynamic_playlist) return;
    set_tag(fetched_tag);
    set_playlist_queries(res.data.queries);
  };

  useEffect(() => {
    fetch_tag();
    // eslint-disable-next-line
  }, []);

  if (!tag) return <h2>Loading Tag...</h2>;

  return (
    <div>
      <Stack direction="row" spacing={1}>
        <Subscriptions fontSize="large" />
        <h2>{tag.name}</h2>
      </Stack>
      <Stack direction="row" spacing={1}>
        <Chip size="small" variant="outlined" label={tag.id} color="primary" />
        {tag.default_excluded && <Chip size="small" variant="outlined" label={"Default Excluded"} color="primary" />}
      </Stack>
      <ButtonGroup sx={{ margin: "10px 0px 10px 0px" }} variant="contained" size="large">
        <Button href={`/playlists?tags_index_tab=0`}>Back</Button>
        <Button href={`/dynamic-playlist/${tag_id}/order/${1}`}>Play</Button>
        <Button href={`/playlists/${tag_id}/edit`}>Edit</Button>
        <Button href={`/playlists/${tag_id}/delete`}>Delete</Button>
      </ButtonGroup>
      <DynamicPlaylistQueries queries={playlist_queries} tag_id={tag.id} />
    </div>
  );
};

export default observer(PlayListDetailsPage);
