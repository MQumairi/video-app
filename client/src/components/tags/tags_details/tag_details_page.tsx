import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Tag } from "../../../api/agent";
import ITag from "../../../models/tag";
import IVideoMeta from "../../../models/video_meta";
import { PathConverter } from "../../../util/path_converter";
import HrefButton from "../../misc/href_button";
import BrowserResults from "../../browser/browser_results";

const TagDetailsPage = () => {
  let tag_id = useParams().tag_id ?? 1;
  const [tag, set_tag] = useState<ITag | null>(null);
  const [random_vid, set_random_vid] = useState<IVideoMeta | null>(null);

  const fetch_tag = async () => {
    let response: ITag = (await Tag.details(+tag_id)).data;
    set_tag(response);
  };

  const fetch_random_tag_video = async () => {
    let response: IVideoMeta = (await Tag.shuffle(+tag_id)).data;
    set_random_vid(response);
  };

  useEffect(() => {
    fetch_tag();
    fetch_random_tag_video();
  }, []);

  return (
    <div>
      {tag && <h1>Tag: {tag?.name}</h1>}
      <HrefButton href={`/tags/${tag_id}/delete`} textContent={"Delete"} />
      {random_vid && <HrefButton textContent="Random" href={`/tags/${tag_id}/video/${PathConverter.to_query(random_vid.path)}`} />}
      {tag && <BrowserResults videos={tag.videos} directory_paths={[]} back_url={"/tags"} />}
    </div>
  );
};

export default observer(TagDetailsPage);
