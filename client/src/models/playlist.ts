import IVideoMeta from "./video_meta";

export default interface IPlaylist {
  id: number;
  name: string;
  videos: IVideoMeta[];
}
