import { join, dirname, basename } from "path";
import { FileOperation } from "./file_system/file_operations";

export class FileTrasher {
  static TRASH_PATH = "trash/";

  static async trash(file_path: string): Promise<boolean> {
    const trash_dir = join(this.TRASH_PATH, dirname(file_path));
    const destination_path = join(trash_dir, basename(file_path));
    return FileOperation.move(file_path, destination_path);
  }
}
