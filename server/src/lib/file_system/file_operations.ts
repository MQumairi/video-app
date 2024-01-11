import { rename } from "fs/promises";
import { mkdirSync, existsSync, writeFileSync } from "fs";
import { dirname } from "path";

export class FileOperation {
  static async move(src_path: string, dest_path: string): Promise<boolean> {
    // Create directory of dest_path if it doesn't exist
    FileOperation.create_dir(dirname(dest_path));
    // Move file to directory of dest_path
    try {
      await rename(src_path, dest_path);
    } catch (err) {
      console.log("err:", err);
    }
    return existsSync(dest_path);
  }

  static async create_dir(dir_path: string) {
    if (!existsSync(dir_path)) {
      mkdirSync(dir_path, { recursive: true });
    }
  }

  static async create_file(file_path: string, data: string) {
    const file_parent = dirname(file_path);
    await FileOperation.create_dir(file_parent);
    if (!existsSync(file_path)) {
      writeFileSync(file_path, data);
    }
  }
}
