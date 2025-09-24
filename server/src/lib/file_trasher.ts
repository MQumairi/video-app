import { join, dirname, basename, sep } from "path";
import { FileOperation } from "./file_system/file_operations";

export class FileTrasher {
  static TRASH_PATH = "trash/";
  /**
   * Walks up the directory tree until it finds "videos" or "images".
   * Returns the absolute path to the trash folder inside that directory.
   */
  private static findTrashDir(file_path: string): string {
    let currentDir = dirname(file_path);

    while (true) {
      const parts = currentDir.split(sep);
      const folderName = parts[parts.length - 1];

      if (folderName === "videos" || folderName === "images") {
        return join(currentDir, "trash");
      }

      const parentDir = dirname(currentDir);

      // If we reached root, stop
      if (parentDir === currentDir) {
        return FileTrasher.TRASH_PATH;
      }

      currentDir = parentDir;
    }
  }

  static async trash(file_path: string): Promise<boolean> {
    const trash_dir = this.findTrashDir(file_path);
    const destination_path = join(trash_dir, basename(file_path));
    return FileOperation.move(file_path, destination_path);
  }
}