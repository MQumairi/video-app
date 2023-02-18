import { getRepository } from "typeorm";
import { Request, Response } from "express";
import { VideoMeta } from "../../models/video_meta";
import { ImageMeta } from "../../models/image_meta";
import { ImageGallery } from "../../models/image_gallery";

const CleanupThumbnails = async (req: Request, res: Response): Promise<void> => {
  console.log("cleaning database from videos with galleries but not thumbnails");
  const video_repo = getRepository(VideoMeta);
  const videos = await video_repo.find({ select: ["id"] });
  console.log(`videos found: ${videos.length}`);
  const result = new Map<string, boolean>();
  const counter = { unchanged_videos: 0, changed_videos: 0, changed_galleries: 0 };
  const image_repo = getRepository(ImageMeta);
  for (let v of videos) {
    console.log(`evaluating v ${v.id}`);
    const video = await video_repo.findOne({ relations: ["thumbnail", "gallery", "tags"], where: { id: v.id } });
    if (!video || !video.gallery) {
      counter.unchanged_videos += 1;
      continue;
    }
    const gallery = video.gallery;
    if (video.tags) {
      console.log("applying tags to gallery");
      ImageGallery.apply_tags(gallery, video.tags);
    }

    if (video.thumbnail) {
      counter.unchanged_videos += 1;
      continue;
    }
    const first_gallery_image = await image_repo.findOne({ where: { gallery: video.gallery } });
    if (!first_gallery_image) {
      counter.unchanged_videos += 1;
      continue;
    }
    video.thumbnail = first_gallery_image;
    await video_repo.save(video);
    counter.changed_videos += 1;
  }
  console.log("done cleanup missing videos:", counter);
  res.status(200).json(Object.fromEntries(result));
};

export default CleanupThumbnails;
