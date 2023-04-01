import { getRepository } from "typeorm";
import { ImageGallery } from "../../models/image_gallery";
import { VideoMeta } from "../../models/video_meta";

export default class VideoTrasher {
  static async trash(video: VideoMeta): Promise<Boolean> {
    const video_repo = getRepository(VideoMeta);
    const found_vid = await video_repo.findOne(video, { relations: ["gallery"] });
    if (!found_vid) return false;
    // Trash any associated gallery files
    const gallery_delete_success = await VideoTrasher.trash_gallery(found_vid.gallery);
    if (!gallery_delete_success) return false;
    // Trash video file
    return await VideoMeta.delete_video(video);
  }

  private static async trash_gallery(gallery?: ImageGallery): Promise<Boolean> {
    if (!gallery) return true;
    return await ImageGallery.delete_gallery(gallery);
  }
}
