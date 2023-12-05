import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { VideoMeta } from "../../models/video_meta";

const Edit = async (req: Request, res: Response): Promise<VideoMeta | undefined> => {
  const id = +req.params.id;
  const video_repo = getRepository(VideoMeta);
  const video = await video_repo.findOne(id);
  if (!video) {
    res.status(404).send("Video not found");
    return;
  }
  video.name = req.body.name;
  video.series_order = req.body.series_order;
  await video_repo.save(video!);
  res.status(201).send(video);
  return video;
};

export default Edit;
