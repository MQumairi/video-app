import IVideoMeta from "./video_meta";

export default interface ISeries {
  id: number;
  name: string;
  videos: IVideoMeta[];
}
