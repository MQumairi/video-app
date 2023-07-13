import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { VideoMeta } from "../../models/video_meta";
import { ImageGallery } from "../../models/image_gallery";

const PairGalleryToVideo = async (req: Request, res: Response) => {
  console.log("entered pair gallery to video");
  try {
    const video_id = req.body.video_id;
    const gallery_id = req.body.gallery_id;
    const video_repo = getRepository(VideoMeta);
    const gallery_repo = getRepository(ImageGallery);
    const video = await video_repo.findOne(video_id, { relations: ["gallery", "thumbnail", "file_scripts", "tags"] });
    const gallery = await gallery_repo.findOne(gallery_id, { relations: ["images", "tags", "thumbnail"] });
    if (!video || !gallery) {
      res.status(404).send({ message: `data not found, video: ${video?.id}, gallery: ${gallery?.id}` });
      return;
    }
    video.gallery = gallery;
    await video_repo.save(video);
    res.status(201).send({ message: `video gallery changed to ${video.gallery.id}` });
    return;
  } catch (error) {
    //Upon failure, do the following
    console.log("encountered error:", error);
    res.status(409).send("Failed to associate gallery to video, error:\n" + error);
  }
};

export default PairGalleryToVideo;
