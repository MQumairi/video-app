import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { VideoMeta } from "../../models/video_meta";
import ThumbnailGenerator from "../../lib/images_lib/thumbnail_generator";

const CreateGalleryFromVideo = async (req: Request, res: Response) => {
  console.log("entered create from video");
  try {
    const video_id = req.body.video_id;
    console.log(`video id ${video_id}`);
    const video_repo = getRepository(VideoMeta);
    const video = await video_repo.findOne(video_id, { relations: ["gallery", "thumbnail", "file_scripts", "tags"] });
    if (!video) {
      res.status(404).send({ message: "video not found" });
      return;
    }
    // Don't await given length of task
    ThumbnailGenerator.thumb_video(video);
    res.status(201).send({ message: "thumbnail creation started" });
    return;
  } catch (error) {
    //Upon failure, do the following
    console.log("encountered error:", error);
    res.status(409).send("Failed to create Thumbnail, error:\n" + error);
  }
};

export default CreateGalleryFromVideo;
