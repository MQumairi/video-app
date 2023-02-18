import { mkdirSync, existsSync } from "fs";
import { rename } from "fs/promises";
import path from "path";

export class FileTrasher {
  static TRASH_PATH = "trash/";

  static async trash(file_path: string): Promise<boolean> {
    const trash_dir_path = this.find_or_create_trash_dir(file_path);
    const file_name = path.basename(file_path);
    const destination_path = path.join(trash_dir_path, file_name);
    let res = false;
    try {
      await rename(file_path, destination_path);
    } catch (err) {
      console.log("err:", err);
    }
    return existsSync(destination_path);
  }

  private static find_or_create_trash_dir(file_path: string): string {
    const trash_dir = path.join(this.TRASH_PATH, path.dirname(file_path));
    if (!existsSync(trash_dir)) {
      console.log("making trash");
      mkdirSync(trash_dir, { recursive: true });
    }
    return trash_dir;
  }
}
