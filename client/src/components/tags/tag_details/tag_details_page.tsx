import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Tag } from "../../../api/agent";
import ITag from "../../../models/tag";
import { TagVideoList } from "./tag_video_list";

export const TagDetailsPage = () => {
  let tag_id = useParams().id ?? 1;
  const [tag, set_tag] = useState<ITag | null>(null);

  const fetch_tag = async () => {
    console.log("id is ", tag_id);
    let response: ITag = (await Tag.details(+tag_id)).data;
    console.log("resp is ", response);
    set_tag(response);
  };

  useEffect(() => {
    fetch_tag();
  }, []);
  return (
    <div>
      {tag && <h1>Tag: {tag?.name}</h1>}
      <TagVideoList videos={tag?.videos} />
    </div>
  );
};
