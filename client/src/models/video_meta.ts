import ISeries from "./series";
import ITag from "./tag";
import IVideoScript from "./video_script";

export default interface IVideoMeta {
  id: number;
  name: string;
  path: string;
  parent_path: string;
  tags?: ITag[];
  rating: number;
  series_order: number;
  series?: ISeries;
  scripts?: IVideoScript[];
}
