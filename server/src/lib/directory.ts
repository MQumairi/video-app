export interface IDirectory {
  path: string;
  url: string;
  name: string;
}

import fs from "fs/promises";
import path from "path";
import { Dir, existsSync } from "fs";
import { VideoMeta } from "../models/video_meta";
import { VideoScript } from "../models/video_script";

export class Directory {
  static async from_path(path: string): Promise<Directory | undefined> {
    if (!existsSync(path) || !(await Directory.is_directory(path))) {
      return undefined;
    }
    let directory = new Directory(path);
    await directory.read_contents();
    return directory;
  }

  name: string;
  path: string;
  parent_path: string;
  video_paths: VideoMeta[] = [];
  directory_paths: Directory[] = [];
  scripts: VideoScript[] = [];

  constructor(path_: string) {
    this.name = path.basename(path_);
    this.path = path.join(path_);
    this.parent_path = path.dirname(path_);
    if (this.parent_path == ".") {
      this.parent_path = this.path;
    }
  }

  async read_contents() {
    this.scripts = await this.list_script_paths();
    this.video_paths = await this.list_video_paths();
    this.directory_paths = await this.list_directory_paths();
  }

  async list_directory_paths(): Promise<Directory[]> {
    let all_file_paths = await this.list_file_paths();
    let directory_paths: Directory[] = [];
    for (let file of all_file_paths) {
      let full_file_path = path.join(this.path, file);
      if (await Directory.is_directory(full_file_path)) {
        const directory = new Directory(full_file_path);
        directory.scripts.push(...this.scripts);
        directory_paths.push(directory);
      }
    }
    return directory_paths;
  }

  async list_video_paths(): Promise<VideoMeta[]> {
    let all_file_paths = await this.list_file_paths();
    let video_paths: VideoMeta[] = [];
    for (let file of all_file_paths) {
      let full_file_path = path.join(this.path, file);
      if (Directory.is_video(full_file_path)) {
        const video = new VideoMeta(full_file_path);
        video.scripts = this.scripts;
        video_paths.push(video);
      }
    }
    return video_paths;
  }

  async list_script_paths(): Promise<VideoScript[]> {
    let all_file_paths = await this.list_file_paths();
    let script_paths: VideoScript[] = [];
    for (let file of all_file_paths) {
      let full_file_path = path.join(this.path, file);
      if (await Directory.is_script(full_file_path)) {
        script_paths.push(new VideoScript(full_file_path));
      }
    }
    return script_paths;
  }

  async list_file_paths(): Promise<string[]> {
    let file_list: string[] = await fs.readdir(this.path);
    return file_list;
  }

  static async is_directory(file_path: string): Promise<boolean> {
    return (await fs.stat(file_path)).isDirectory();
  }

  static async is_script(file_path: string): Promise<boolean> {
    return file_path.endsWith(".sh");
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
