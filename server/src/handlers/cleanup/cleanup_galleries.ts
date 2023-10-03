import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { VideoMeta } from "../../models/video_meta";
import { ImageGallery } from "../../models/image_gallery";
import { parse } from "path";
import { DestinationGuider } from "../../lib/images_lib/destination_guider";
import { VideoBatcher } from "../../lib/videos_lib/video_batcher";

// Given a video, find its gallery if it exists, and move all gallery images to an appropriate location
const batcher_handler = async (video: VideoMeta, args: any[] = []): Promise<boolean> => {
  const gallery = video.gallery;
  const parsed_video_path = parse(video.path);
  if (!gallery || !parsed_video_path) return true;
  const image_dir = DestinationGuider.image_dir_from_video(video);
  return await ImageGallery.move_gallery_files(gallery, image_dir);
};

const CleanupGalleries = async (req: Request, res: Response) => {
  const video_repo = getRepository(VideoMeta);
  const video_query = video_repo
    .createQueryBuilder("video")
    .addGroupBy("video.id")
    .leftJoinAndSelect("video.gallery", "gallery")
    .leftJoinAndSelect("video.thumbnail", "thumbnail")
    .leftJoinAndSelect("gallery.images", "image")
    .addGroupBy("gallery.id")
    .addGroupBy("thumbnail.id")
    .addGroupBy("image.id")
    .addOrderBy("video.id");
  const batcher_result = await VideoBatcher.execute_handler(video_query, batcher_handler, []);
  console.log("batcher result:", batcher_result);
  res.status(200).json(batcher_result);
};

export default CleanupGalleries;
