import { observer } from "mobx-react-lite";
import ITag from "../../../models/tag";
import VideoList from "../../videos/util/video_list";
import PageSelector from "../../search/page_selector";

interface IProps {
  tag: ITag;
  pages_total: number;
  current_page: number;
  handle_page_change: (page: number) => void;
}

const TagVideosTab = (props: IProps) => {
  return (
    <div>
      <VideoList base={`/tags/${props.tag.id}/video`} videos={props.tag.videos} />
      {props.pages_total > 0 && <PageSelector pages={props.pages_total} current_page={props.current_page} set_current_page={props.handle_page_change} />}
    </div>
  );
};

export default observer(TagVideosTab);
