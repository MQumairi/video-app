import { Directory } from "./directory";
import { VideoMeta } from "./video_meta";

export class DirectorySearchResult {
  query: string;
  directories: Directory[];
  videos: VideoMeta[];
  constructor(query: string, directories: Directory[], videos: VideoMeta[]) {
    this.query = query;
    this.directories = directories;
    this.videos = videos;
  }
}
