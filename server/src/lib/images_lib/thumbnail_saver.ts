import fs from "fs";
import path from "path";
import { VideoMeta } from "../../models/video_meta";
import { DestinationGuider } from "./destination_guider";
import { Directory } from "../directory";
import { ImageMeta } from "../../models/image_meta";
import { ImageGallery } from "../../models/image_gallery";
import { getRepository } from "typeorm";

export default class ThumbnailSaver {
  static async save_thumbnail(source_path: string, video: VideoMeta): Promise<ImageMeta | undefined> {
    try {
      const thumbnail_directory = await DestinationGuider.find_or_create_destination(video);
      console.log("destination dir:", thumbnail_directory.path);
      const thumbnail_path = ThumbnailSaver.move_thumbnail_file(source_path, thumbnail_directory);
      const gallery = await ImageGallery.find_or_create(video);
      console.log(`assocating to gallery ${gallery.id}`);
      const image = await ImageMeta.add_to_gallery_with_scripts(thumbnail_path, gallery, video.file_scripts);
      if (video.thumbnail && !gallery.thumbnail) {
        console.log(`setting thumbnail for gallery ${gallery.id}`);
        gallery.thumbnail = video.thumbnail;
        await getRepository(ImageGallery).save(gallery);
      }
      return image;
    } catch (err) {
      console.log("rescued error:", err);
    }
  }

  static async save_thumbnail_with_timestamp(source_path: string, video: VideoMeta, timestamp: number): Promise<ImageMeta | undefined> {
    const thumbnail_directory = await DestinationGuider.find_or_create_destination(video);
    console.log("destination dir:", thumbnail_directory.path);
    const thumbnail_path = ThumbnailSaver.move_thumbnail_file(source_path, thumbnail_directory);
    const gallery = await ImageGallery.find_or_create(video);
    console.log(`assocating to gallery ${gallery.id}`);
    return await ImageMeta.add_thumbnail_to_video_gallery(thumbnail_path, video, gallery, timestamp);
  }

  private static move_thumbnail_file(source_path: string, thumbnail_directory: Directory): string {
    const thumbnail_name = path.basename(source_path);
    const destination_path = path.join(thumbnail_directory.path, thumbnail_name);
    fs.rename(source_path, destination_path, (err) => {
      if (err) console.log("encountered error:", err);
    });
    return destination_path;
  }
}
