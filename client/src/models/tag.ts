import IVideoMeta from "./video_meta";

export default interface ITag {
  id: number;
  name: string;
  videos: IVideoMeta[];
  child_tags?: ITag[];
}
