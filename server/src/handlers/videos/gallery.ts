import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { ImageGallery } from "../../models/image_gallery";
import { VideoMeta } from "../../models/video_meta";
import { ImagePreprocessor } from "../../lib/images_lib/image_preprocessor";

const Gallery = async (req: Request, res: Response): Promise<ImageGallery | undefined> => {
  console.log("entered video gallery");
  const video_id = +req.params.id;
  const video_repo = getRepository(VideoMeta);
  const video = await video_repo.findOne(video_id, { relations: ["gallery"] });
  if (!video) {
    console.log("video not found");
    res.status(404).send({ message: "video not found" });
    return;
  }
  const gallery = video.gallery;
  if (!gallery) {
    console.log("gallery not found");
    res.status(404).send({ message: "gallery not found" });
    return;
  }
  console.log(`found gallery ${gallery.id}`);
  await ImagePreprocessor.process_gallery(gallery);
  const images = gallery.images.sort((i1, i2) => {
    return i1.timestamp_secs - i2.timestamp_secs;
  });
  gallery.images = images;
  res.status(200).send(gallery);
  return gallery;
};

export default Gallery;
