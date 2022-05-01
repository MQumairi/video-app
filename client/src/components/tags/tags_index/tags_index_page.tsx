import { useEffect, useState } from "react";
import { Tag } from "../../../api/agent";
import ITag from "../../../models/tag";
import { HrefButton } from "../../misc/href_button";
import { TagsList } from "./tags_list";

export const TagsIndexPage = () => {
  const [tags, set_tags] = useState<ITag[]>([]);
  const fetch_tags = async () => {
    let received_tags = (await Tag.get()).data;
    set_tags(received_tags);
  };
  useEffect(() => {
    fetch_tags();
  }, []);
  return (
    <div>
      <h1>Tags</h1>
      <HrefButton href="/tags/new" textContent="Create" />
      <TagsList tags={tags} />
    </div>
  );
};
