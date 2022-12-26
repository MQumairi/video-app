import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Series } from "../../models/series";
import { VideoMeta } from "../../models/video_meta";

const add_series_video = async (req: Request, res: Response): Promise<Series | undefined> => {
  const id = +req.params.id;
  const series_repo = getRepository(Series);
  const video_repo = getRepository(VideoMeta);
  let found_series = await series_repo.findOne({ relations: ["videos"], where: { id: id } });
  if (!found_series) {
    res.status(404).send("Series not found");
    return undefined;
  }
  const videos_to_add: VideoMeta[] = req.body.videos ?? [];
  for (let received_video of videos_to_add) {
    const found_in_series = found_series.videos.find((vid) => vid.path == received_video.path);
    if (!found_in_series) {
      let added_video = await video_repo.findOne({ where: { name: received_video.name } });
      found_series.videos.push(added_video ?? (await video_repo.save(new VideoMeta(received_video.path))));
    }
  }
  await series_repo.save(found_series);
  res.status(201).send(found_series);
  return found_series;
};

const AddVideo = async (req: Request, res: Response): Promise<Series | undefined> => {
  console.log("entered add video to series");
  try {
    return add_series_video(req, res);
  } catch (error) {
    console.log("Error:", error);
  }
};

export default AddVideo;
