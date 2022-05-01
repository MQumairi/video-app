import path from "path";

export class VideoMeta {
  name: string;
  path: string;

  constructor(path_: string) {
    this.name = VideoMeta.get_file_name(path_);
    this.path = path_;
  }

  static get_file_name(path_: string): string {
    return path.basename(path_);
  }
}
