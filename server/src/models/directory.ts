export interface IDirectory {
  path: string;
  url: string;
  name: string;
}

import fs from "fs/promises";
import path from "path";

export class Directory {
  path: string;

  constructor(path_: string) {
    this.path = path.join(path_);
  }

  async list_directory_paths(): Promise<string[]> {
    let all_file_paths = await this.list_file_paths();
    let directory_paths: string[] = [];
    for (let file of all_file_paths) {
      let full_file_path = path.join(this.path, file);
      if (await Directory.is_directory(full_file_path)) {
        directory_paths.push(full_file_path);
      }
    }
    return directory_paths;
  }

  async list_video_paths(): Promise<string[]> {
    let all_file_paths = await this.list_file_paths();
    let video_paths: string[] = [];
    for (let file of all_file_paths) {
      let full_file_path = path.join(this.path, file);
      if (Directory.is_video(full_file_path)) {
        video_paths.push(full_file_path);
      }
    }
    return video_paths;
  }

  async list_file_paths(): Promise<string[]> {
    let file_list: string[] = await fs.readdir(this.path);
    return file_list;
  }

  static async is_directory(file_path: string): Promise<boolean> {
    return (await fs.stat(file_path)).isDirectory();
  }

  static video_extensions = [".mp4", ".mov"];

  static is_video(file_path: string): boolean {
    for (let extension of Directory.video_extensions) {
      if (file_path.endsWith(extension)) {
        return true;
      }
    }
    return false;
  }

  get_parent_dir(): string {
    let parent = path.dirname(this.path);
    return parent;
  }
}
