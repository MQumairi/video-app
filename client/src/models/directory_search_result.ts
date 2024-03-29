import IDirectory from "./directory";
import IVideoMeta from "./video_meta";

export default interface IDirectorySearchResult {
  query: string;
  directories: IDirectory[];
  videos: IVideoMeta[];
}
