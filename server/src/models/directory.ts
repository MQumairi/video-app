export interface IDirectory {
  path: string;
  url: string;
  name: string;
}

import fs from "fs/promises";
import path from "path";
import { existsSync } from "fs";
import { VideoMeta } from "./video_meta";
import { getRepository } from "typeorm";
import { Tag } from "./tag";

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
  video_paths: VideoMeta[];
  directory_paths: string[];

  constructor(path_: string) {
    this.name = path.basename(path_);
    this.path = path.join(path_);
    this.parent_path = path.dirname(path_);
    if (this.parent_path == ".") {
      this.parent_path = this.path;
    }
  }

  async read_contents() {
    this.video_paths = await this.list_video_paths();
    this.directory_paths = await this.list_directory_paths();
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

  async process_sub_dirs(directories: string[]): Promise<void> {
    const tag_repo = getRepository(Tag);
    directories.forEach(async (d) => {
      // Create tags if tag corresponding to sub_dir doesn't exist
      let tag_name = path.basename(d);
      const tag = new Tag();
      tag.name = tag_name;
      const found_tag = await tag_repo.findOne({ where: { name: tag_name } });
      if (!found_tag) {
        tag_repo.save(tag);
      }
      // Associated this tag with all files in the sub_dir
      let sub_dir = new Directory(d);
      await sub_dir.read_contents();
      // Not async to not block
      await sub_dir.apply_tags_to_videos(tag, sub_dir.video_paths);
    });
  }

  async apply_tags_to_videos(tag: Tag, videos: VideoMeta[]): Promise<void> {
    videos.forEach(async (v) => {
      console.log("video is:", v.name);
      await VideoMeta.apply_tag(v, tag);
    });
  }

  async list_video_paths(): Promise<VideoMeta[]> {
    let all_file_paths = await this.list_file_paths();
    let video_paths: VideoMeta[] = [];
    for (let file of all_file_paths) {
      let full_file_path = path.join(this.path, file);
      if (Directory.is_video(full_file_path)) {
        video_paths.push(new VideoMeta(full_file_path));
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
