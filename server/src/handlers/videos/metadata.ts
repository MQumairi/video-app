import { Request, Response } from "express";
import { VideoMeta } from "../../models/video_meta";
import { Directory } from "../../lib/directory";
import { not_found_error } from "../../app";
import { getRepository } from "typeorm";
import { existsSync } from "fs";
import { ScriptManager } from "../../lib/script_manager";

const video_file_is_missing = async (video: VideoMeta, res: Response): Promise<boolean> => {
  if (video.scripts && video.scripts.length > 0) return false;
  const video_repo = getRepository(VideoMeta);
  if (!existsSync(video.path)) {
    console.log("video path doesn't exist. Removing from database");
    await video_repo.remove(video);
    res.status(404).send(not_found_error);
    return true;
  }
  return false;
};

const execute_video_scripts = async (video: VideoMeta): Promise<void> => {
  const scripts = video.scripts;
  for (const script of scripts) {
    if (!script.auto_exec_on_start) continue;
    const cmd_res = await ScriptManager.execute(script);
    console.log("command result:", cmd_res);
  }
};

const is_video = (vid_path: string, res: Response): boolean => {
  if (!Directory.is_video(vid_path)) {
    res.status(404).send(not_found_error);
    return false;
  }
  return true;
};

const get_video_meta = async (req: Request, res: Response): Promise<VideoMeta | undefined> => {
  console.log("entered get_video_meta");
  const vid_path = req.params.filepath;
  console.log("did not find video in db");
  let vid_meta = new VideoMeta(vid_path);
  const video_repo = getRepository(VideoMeta);
  const found_video = await video_repo.findOne({ relations: ["tags", "series", "scripts"], where: { path: vid_meta.path } });
  if (!is_video) return undefined;
  if (found_video) {
    console.log(`found video of id ${found_video.id} in db`);
    if (await video_file_is_missing(found_video, res)) return undefined;
    await execute_video_scripts(found_video);
    res.status(200).send(found_video);
    return found_video;
  }
  res.status(200).send(vid_meta);
  return vid_meta;
};

const Metadata = async (req: Request, res: Response): Promise<VideoMeta | undefined> => {
  try {
    return await get_video_meta(req, res);
  } catch (error) {
    console.log("error is:", error);
  }
};

export default Metadata;
