import { useEffect, useState } from "react";
import { Tag } from "../../../api/agent";
import ITag from "../../../models/tag";

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
      Tags index page
      {tags.map((tag) => {
        return <div key={tag.name}>{tag.name}</div>;
      })}
      <a href="/tags/new">Create</a>
    </div>
  );
};
