export interface IDirectory {
  path: string;
  url: string;
  name: string;
}

import fs from "fs/promises";

export class Directory {
  path: string;

  constructor(path: string) {
    this.path = path;
  }

  async list_directory_paths(directory: Directory): Promise<string[]> {
    let all_file_paths = await this.list_file_paths(directory);
    let directory_paths = all_file_paths;
    return directory_paths;
  }

  async list_video_paths(directory: Directory): Promise<string[]> {
    let all_file_paths = await this.list_file_paths(directory);
    let video_paths = all_file_paths;
    return video_paths;
  }

  async list_file_paths(directory: Directory): Promise<string[]> {
    let file_list: string[] = await fs.readdir(directory.path);
    return file_list;
  }

  async is_directory(file_path: string): Promise<boolean> {
    return (await fs.stat(file_path)).isDirectory();
  }

  static video_extensions = [".mp4", ".mov"];

  is_video(file_path: string): boolean {
    for (let extension of Directory.video_extensions) {
      if (file_path.endsWith(extension)) {
        return true;
      }
    }
    return false;
  }
}
