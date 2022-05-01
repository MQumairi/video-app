import { useEffect, useState } from "react";
import { Tag } from "../../../api/agent";
import ITag from "../../../models/tag";
import { AppButton } from "../../misc/app_button";

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
      <AppButton href="/tags/new" textContent="Create" />
      {tags.map((tag) => {
        return <div key={tag.name}>{tag.name}</div>;
      })}
    </div>
  );
};
