import path from "path";

export class VideoMeta {
  name: string;
  path: string;
  parent_path: string;

  constructor(path_: string) {
    this.name = path.basename(path_);
    this.path = path_;
    this.parent_path = path.dirname(path_);
  }
}
