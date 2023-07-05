import { Directory } from "../directory";
import { dirname, join, parse } from "path";
import { VideoMeta } from "../../models/video_meta";
import { FileOperation } from "../file_system/file_operations";

export class DestinationGuider {
  static IMAGE_PATH = "images/";

  static async find_or_create_destination(video: VideoMeta): Promise<Directory> {
    const image_dir = DestinationGuider.image_dir_from_video(video);
    await FileOperation.create_dir(image_dir);
    return new Directory(image_dir);
  }

  static image_dir_from_video(video: VideoMeta): string {
    const parsed_video_path = parse(video.path);
    return join(DestinationGuider.IMAGE_PATH, dirname(video.path), parsed_video_path.name);
  }
}
