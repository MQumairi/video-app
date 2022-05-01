import IVdeoMeta from "./video_meta";

export default interface IDirectory {
  name: string;
  path: string;
  parent_path: string;
  video_paths: IVdeoMeta[];
  directory_paths: string[];
}
