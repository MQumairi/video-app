import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Tag } from "../../../api/agent";
import ITag from "../../../models/tag";
import VideoTags from "../../player/video_tags";
import TagVideoPopover from "../tag_popover/tag_video_popover";
import { Button, ButtonGroup } from "@mui/material";
import TagSearcher from "../tag_popover/tag_searcher";

const TagEditPage = () => {
  let tag_id = useParams().tag_id ?? 1;
  const [tag, set_tag] = useState<ITag | null>(null);
  const [selected_tags, set_selected_tags] = useState<ITag[]>([]);

  const generate_thumbnails = async () => {
    console.log("generating...");
    if (!tag) return;
    Tag.generate_video_thumbnails(tag);
  };

  const handle_child_tag_add = async () => {
    if (!tag) return;
    await Tag.add_children(tag, selected_tags);
  };

  useEffect(() => {
    const fetch_tag = async () => {
      const res = await Tag.details(+tag_id);
      if (res.status != 200) return;
      set_tag(res.data.tag);
    };

    fetch_tag();
  }, []);

  if (!tag) return <h2>Loading tag</h2>;

  return (
    <div>
      <h1>Editing Tag: {tag.name}</h1>
      <ButtonGroup variant="contained" size="large">
        <Button href={`/tags/${tag_id}`}>Back</Button>
        <Button
          onClick={async () => {
            await generate_thumbnails();
          }}
        >
          Generate Thumbnails
        </Button>
      </ButtonGroup>
      <div style={{ margin: "20px 0px 20px 0px" }}>
        <TagSearcher selected_tags={selected_tags} set_selected_tags={set_selected_tags} />
        <Button style={{ marginTop: "10px" }} variant="contained" onClick={handle_child_tag_add}>
          Add Child Tags
        </Button>
      </div>
      {tag.child_tags && <VideoTags tags={tag.child_tags} />}
    </div>
  );
};

export default observer(TagEditPage);
