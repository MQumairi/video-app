import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { VideoMeta } from "../../models/video_meta";
import { VideoFileProber } from "../../lib/videos_lib/video_file_probber";

const ProcessVideoMeta = async (req: Request, res: Response): Promise<VideoMeta | undefined> => {
  console.log("entered ProcessVideoMeta");
  const id = +req.params.id;
  const video_repo = getRepository(VideoMeta);
  const video = await video_repo.findOne(id);
  if (!video) {
    res.status(404).send("video not found");
    return;
  }
  const prober = new VideoFileProber(video.path);
  const duration = await prober.get_video_duration();
  const resolution = await prober.get_video_resolution();
  video.duration_sec = duration;
  if (resolution) {
    video.width = resolution.width;
    video.height = resolution.height;
  }
  const stats = prober.get_file_stats();
  video.created_at = stats.created_at;
  video.size_mb = stats.file_size;
  console.log("finished probing");
  const saved_video = await video_repo.save(video);
  res.status(200).send(saved_video);
  return saved_video;
};

export default ProcessVideoMeta;
