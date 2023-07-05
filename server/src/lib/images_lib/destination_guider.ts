import { Directory } from "../directory";
import { dirname, join } from "path";
import { VideoMeta } from "../../models/video_meta";
import { FileOperation } from "../file_system/file_operations";

export class DestinationGuider {
  static IMAGE_PATH = "images/";

  static async find_or_create_destination(video: VideoMeta): Promise<Directory> {
    const image_dir = join(this.IMAGE_PATH, dirname(video.path));
    await FileOperation.create_dir(image_dir);
    return new Directory(image_dir);
  }
}
