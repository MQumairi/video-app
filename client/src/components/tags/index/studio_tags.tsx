import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { Tag } from "../../../api/agent";
import ITag from "../../../models/tag";
import TagsList from "./tags_list";

const StudioTags = () => {
  const [tags, set_tags] = useState<ITag[]>([]);
  const fetch_tags = async () => {
    const res = await Tag.studios();
    if (res.status !== 200) return;
    set_tags(res.data);
  };
  useEffect(() => {
    fetch_tags();
  }, []);
  return (
    <div>
      <h1>Studios</h1>
      <TagsList tags={tags} />
    </div>
  );
};

export default observer(StudioTags);
