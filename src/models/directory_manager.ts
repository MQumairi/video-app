import path, { dirname } from "path";
import fs from "fs/promises";
import { IDirectory } from "./directory";
import { IVideoFile } from "./video_file";

export class DirectoryManager {
  async listDirectories(): Promise<IDirectory[]> {
    let out: IDirectory[] = [];
    for (let file_name of await this.listItems()) {
      let full_path = path.join(DirectoryManager.getDataPath(), file_name);
      if (await this.isDirectory(full_path)) {
        let directory: IDirectory = {
          path: full_path,
          url: `directory/${file_name}`,
          name: file_name,
        };
        out.push(directory);
      }
    }
    return out;
  }

  async listVideos(dir_path: string): Promise<IVideoFile[]> {
    let files = await this.listItems(dir_path);
    let out: IVideoFile[] = [];
    for (let file_name of files) {
      if (await this.isVideo(file_name)) {
        let directory = path.basename(dir_path);
        let video_file: IVideoFile = {
          name: file_name,
          url: `directory/${directory}/video/${file_name}`,
        };
        out.push(video_file);
      }
    }
    return out;
  }

  async isDirectory(file_path: string): Promise<boolean> {
    return (await fs.stat(file_path)).isDirectory();
  }

  async isVideo(file_path: string): Promise<boolean> {
    let extension = path.extname(file_path);
    return extension == ".mp4" || extension == ".mov";
  }

  async listItems(directory: string = DirectoryManager.getDataPath()): Promise<string[]> {
    let fileList: string[] = await fs.readdir(directory);
    return fileList;
  }

  static getRootPath(): string {
    return dirname(require.main!.filename) + "/..";
  }
  static getFilePath(file_path: string): string {
    return path.join(DirectoryManager.getRootPath(), file_path);
  }

  static getDataPath(): string {
    return DirectoryManager.getFilePath("data");
  }
}
