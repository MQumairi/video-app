import IImageMeta from "./image_meta";
import IVideoMeta from "./video_meta";

export default interface IFileScript {
  id: number;

  name: string;

  path: string;

  is_start_script: boolean;

  is_manual_script: boolean;

  is_global_script: boolean;

  videos: IVideoMeta[];

  images: IImageMeta[];
}
