import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { VideoMeta } from "../../models/video_meta";
import ThumbnailSaver from "../../lib/images_lib/thumbnail_saver";

const UploadForVideo = async (req: Request, res: Response): Promise<void> => {
  const video_id = req.body.video;
  const video_repo = getRepository(VideoMeta);
  const video = await video_repo.findOne(video_id, { relations: ["gallery", "tags", "thumbnail", "file_scripts"] });
  const file = req.file;
  if (!video || !file) {
    res.status(404).send({ message: "video not found" });
    return;
  }
  const file_path = file.path;
  console.log("file path is:", file_path);
  const image = await ThumbnailSaver.save_thumbnail(file_path, video);
  if (!image) {
    res.status(500).send({ message: "failed to save thumbnail" });
    return;
  }
  if (!video.thumbnail) {
    video.thumbnail = image;
    await video_repo.save(video);
  }
  console.log(`finished adding thumb to video: ${video_id}`);
  res.send(video);
};

export default UploadForVideo;
