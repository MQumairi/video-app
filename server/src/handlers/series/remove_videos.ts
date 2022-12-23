import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Series } from "../../models/series";
import { VideoMeta } from "../../models/video_meta";

const remove_video = async (req: Request, res: Response): Promise<Series | undefined> => {
  const id = +req.params.id;
  const series_repo = getRepository(Series);
  let found_series = await series_repo.findOne({ relations: ["videos"], where: { id: id } });
  if (!found_series) {
    res.status(404).send("Series not found");
    return undefined;
  }
  const videos_to_remove: VideoMeta[] = req.body.videos ?? [];
  const old_size = found_series.videos.length;
  for (let received_video of videos_to_remove) {
    const found_in_series = found_series.videos.find((vid) => vid.name == received_video.name);
    if (found_in_series) {
      let index_of_video_to_remove = found_series.videos.indexOf(found_in_series);
      found_series.videos.splice(index_of_video_to_remove, 1);
    }
  }
  const new_size = found_series.videos.length;
  console.log("Successfully removed", old_size - new_size, "videos");
  await series_repo.save(found_series);
  res.status(201).send(found_series);
  return found_series;
};

const RemoveVideo = async (req: Request, res: Response): Promise<Series | undefined> => {
  try {
    return remove_video(req, res);
  } catch (error) {
    console.log("Error:", error);
  }
};

export default RemoveVideo;
