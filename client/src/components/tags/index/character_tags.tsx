import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { Tag } from "../../../api/agent";
import ITag from "../../../models/tag";
import TagsList from "./tags_list";

const CharacterTags = () => {
  const [tags, set_tags] = useState<ITag[]>([]);
  const fetch_tags = async () => {
    const res = await Tag.characters();
    if (res.status !== 200) return;
    set_tags(res.data);
  };
  useEffect(() => {
    fetch_tags();
  }, []);
  return (
    <div>
      <h1>Characters</h1>
      <h4>{tags.length} tags</h4>
      <TagsList tags={tags} />
    </div>
  );
};

export default observer(CharacterTags);
