import { Request, Response } from "express";
import { Like, Repository, getRepository } from "typeorm";
import { VideoScript } from "../../models/video_script";
import { existsSync } from "fs";
import { VideoMeta } from "../../models/video_meta";
import { dirname } from "path";

const CleanupScripts = async (req: Request, res: Response): Promise<void> => {
  console.log("Cleaning up scripts");
  const script_repo = getRepository(VideoScript);
  const scripts = await delete_missing_scripts(script_repo);
  console.log(`scripts to process: ${scripts.length}`);
  await associate_videos_to_scripts(script_repo, scripts);
  res.status(200).json({ message: "done" });
  console.log("Done script cleanup");
};

const delete_missing_scripts = async (script_repo: Repository<VideoScript>): Promise<VideoScript[]> => {
  const saved_scripts = await script_repo.find({ relations: ["videos"] });
  const scripts_to_remove: VideoScript[] = [];
  const scripts_to_keep: VideoScript[] = [];
  for (let s of saved_scripts) {
    if (!existsSync(s.path)) scripts_to_remove.push(s);
    else {
      s.videos = [];
      scripts_to_keep.push(s);
    }
  }
  await script_repo.remove(scripts_to_remove);
  return scripts_to_keep;
};

const associate_videos_to_scripts = async (script_repo: Repository<VideoScript>, scripts: VideoScript[]) => {
  const vid_repo = getRepository(VideoMeta);
  for (let s of scripts) {
    const videos = await vid_repo.find({ path: Like(`%${dirname(s.path)}%`) });
    console.log(`script ${s.id} videos: ${videos.length}`);
    s.videos = videos;
    await script_repo.save(s);
  }
};

export default CleanupScripts;
