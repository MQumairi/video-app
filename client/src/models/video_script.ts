import IVideoMeta from "./video_meta";

export default interface IVideoScript {
  id: number;
  name: string;
  path: string;
  command: string;
  auto_exec_on_start: boolean;
  videos: IVideoMeta[];
}
