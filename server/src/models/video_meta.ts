import path from "path";

export class VideoMeta {
  name: string;
  path: string;
  parent_path: string;

  constructor(path_: string) {
    this.name = VideoMeta.get_file_name(path_);
    this.path = path_;
    this.parent_path = VideoMeta.get_parent_dir(path_);
  }

  static get_file_name(path_: string): string {
    return path.basename(path_);
  }

  static get_parent_dir(path_: string): string {
    let parent = path.dirname(path_);
    return parent;
  }
}
