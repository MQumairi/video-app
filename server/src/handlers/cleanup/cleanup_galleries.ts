import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { VideoMeta } from "../../models/video_meta";
import { ImageGallery } from "../../models/image_gallery";
import { parse } from "path";
import { DestinationGuider } from "../../lib/images_lib/destination_guider";
import { VideoBatcher } from "../../lib/videos_lib/video_batcher";

// Given a video, find its gallery if it exists, and set its path to the expected path
const batcher_handler = async (video: VideoMeta, args: any[] = []): Promise<boolean> => {
  const gallery = video.gallery;
  if (!gallery) {
    console.log("no gallery found");
    return true;
  }
  gallery.path = ImageGallery.expected_gallery_path_from_video(video);
  const gallery_repo = getRepository(ImageGallery);
  await gallery_repo.save(gallery);
  return true;
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
