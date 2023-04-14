import { Directory } from "../directory";
import path from "path";
import { mkdirSync } from "fs";

export class DestinationGuider {
  static IMAGE_ROOT: Directory = new Directory("images/");
  static IMAGE_PER_DIR = 500;

  static async find_or_create_destination(): Promise<Directory> {
    // sub directories of IMAGE_ROOT will be where the images are stored
    const sub_dirs = await DestinationGuider.IMAGE_ROOT.list_directory_paths();
    const destination = await DestinationGuider.find_desintation_if_exists(sub_dirs);
    if (!destination) {
      const desintation_name = (sub_dirs.length + 1).toString();
      console.log(`Creating new desination ${desintation_name}`);
      return DestinationGuider.create_destination_dir(desintation_name);
    }
    return destination;
  }

  // Find the subdir with less than IMAGE_PER_DIR in it, else return undefined
  private static async find_desintation_if_exists(sub_dirs: Directory[]): Promise<Directory | undefined> {
    for (let d of sub_dirs) {
      const d_files_n = (await d.list_file_paths()).length;
      if (d_files_n < DestinationGuider.IMAGE_PER_DIR) {
        return d;
      }
    }
    return undefined;
  }

  private static create_destination_dir(desintation_name: string): Directory {
    const new_dir_path = path.join(DestinationGuider.IMAGE_ROOT.path, desintation_name);
    mkdirSync(new_dir_path);
    return new Directory(new_dir_path);
  }
}
