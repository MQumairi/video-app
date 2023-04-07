import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { VideoMeta } from "../../models/video_meta";
import { ImageMeta } from "../../models/image_meta";
import { ImageGallery } from "../../models/image_gallery";

const ThumbVideo = async (req: Request, res: Response): Promise<VideoMeta | undefined> => {
  console.log("entered thumb video");
  const video_id = +req.params.id;
  const video_repo = getRepository(VideoMeta);
  const video = await video_repo.findOne(video_id, { relations: ["gallery"] });
  if (!video) {
    console.log("video not found");
    res.status(404).send({ message: "video not found" });
    return;
  }
  const image_id = req.body.image_id;
  const image = await getRepository(ImageMeta).findOne(image_id);
  if (!image) {
    console.log("image not found");
    res.status(404).send({ message: "image not found" });
    return;
  }
  console.log(`assigning image '${image.id}', to video '${video.id}'`);
  video.thumbnail = image;
  if (video.gallery) {
    ImageGallery.set_thumbnail(video.gallery, image);
    console.log(`assigning image '${image.id}', to gallery '${video.gallery.id}'`);
  }
  const saved_video = await video_repo.save(video);
  console.log("assignment done");
  res.status(200).send(saved_video);
  return saved_video;
};

export default ThumbVideo;
