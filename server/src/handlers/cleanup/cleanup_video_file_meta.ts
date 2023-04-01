import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { VideoMeta } from "../../models/video_meta";
import { VideoFileProber } from "../../lib/videos_lib/video_file_probber";

const CleanupVideoFileMeta = async (req: Request, res: Response) => {
  let video_repo = getRepository(VideoMeta);
  let videos = await video_repo.find({ relations: ["file_scripts"] });
  const counter = { add_duration: 0, add_resolution: 0, unchanged: 0 };
  for (let v of videos) {
    if (v.file_scripts && v.file_scripts.length > 0) {
      console.log(`${v.id} has a script. Not probing.`);
      counter.unchanged += 1;
      continue;
    }
    const video_prober = new VideoFileProber(v.path);
    // Find duration
    const duration = await video_prober.get_video_duration();
    if (duration > 0) {
      v.duration_sec = duration;
      counter.add_duration += 1;
    }
    // Find resolution
    const resolution = await video_prober.get_video_resolution();
    if (resolution) {
      v.width = resolution.width;
      v.height = resolution.height;
    }
    // Save
    await video_repo.save(v);
  }
  console.log("done cleaning up video meta:\n", counter);
};

export default CleanupVideoFileMeta;
