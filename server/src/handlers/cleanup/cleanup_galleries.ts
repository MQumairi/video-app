import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { VideoMeta } from "../../models/video_meta";
import { ImageGallery } from "../../models/image_gallery";

const CleanupGalleries = async (req: Request, res: Response) => {
  const counter = { thumbed_galleries: 0, deleted_galleries: 0, kept_galleries: 0 };
  console.log("counter:", counter);
  // Apply tags to all galleires based on videos
  let video_repo = getRepository(VideoMeta);
  let videos = await video_repo.find();
  console.log("checking videos...");
  for (let v of videos) {
    try {
      const video = await video_repo.findOne(v, { relations: ["tags", "gallery", "thumbnail"] });
      if (!video) continue;
      console.log(`found video: ${video.id}`);
      if (!video.gallery) continue;
      const gallery = video.gallery;
      console.log(`modifying gallery ${gallery.id}, based on vid ${video.id}`);
      await ImageGallery.apply_tags(gallery, video.tags);
      if (gallery.thumbnail || !video.thumbnail) continue;
      console.log(`setting thumbnail for gallery ${gallery.id}, based on vid ${video.id}`);
      await ImageGallery.set_thumbnail(gallery, video.thumbnail);
      counter.thumbed_galleries += 1;
    } catch (err) {
      console.log(`rescued error of video ${v.name}:`, err);
    }
  }
  // Delete all galleries with no images
  let gallery_repo = getRepository(ImageGallery);
  const galleries = await gallery_repo.find({ select: ["id"] });
  for (let g of galleries) {
    const gallery = await gallery_repo.findOne(g.id);
    if (!gallery) continue;
    console.log("found gallery:", gallery.id);
    if (gallery.images.length == 0) {
      console.log("deleting gallery");
      counter.deleted_galleries += 1;
      await gallery_repo.remove(gallery);
      continue;
    }
    counter.kept_galleries += 1;
  }
  console.log("done cleaning up galleries:\n", counter);
};

export default CleanupGalleries;
