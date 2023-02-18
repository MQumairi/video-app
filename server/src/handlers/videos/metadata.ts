import { Request, Response } from "express";
import { VideoMeta } from "../../models/video_meta";
import { Directory } from "../../lib/directory";
import { not_found_error } from "../../app";
import { getRepository } from "typeorm";
import { existsSync } from "fs";
import { FileScript } from "../../models/file_script";

const video_file_is_missing = async (video: VideoMeta, res: Response): Promise<boolean> => {
  if (video.file_scripts && video.file_scripts.length > 0) {
    return false;
  }
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
  const scripts = video.file_scripts;
  for (const script of scripts) {
    if (!script.is_start_script) continue;
    await FileScript.execute_script(script, video.path);
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
  let vid_meta = VideoMeta.create_from_path(vid_path);
  const video_repo = getRepository(VideoMeta);
  const found_video = await video_repo.findOne({ relations: ["tags", "series", "file_scripts"], where: { path: vid_meta.path } });
  if (!is_video) {
    console.log("is not a video");
    return undefined;
  }
  if (found_video) {
    console.log(`found video of id ${found_video.id} in db`);
    if (await video_file_is_missing(found_video, res)) return undefined;
    await execute_video_scripts(found_video);
    res.status(200).send(found_video);
    return found_video;
  } else {
    console.log("video not in db... saving");
    vid_meta = await VideoMeta.save_new_video(vid_meta.path);
  }
  res.status(200).send(vid_meta);
  return vid_meta;
};

const Metadata = async (req: Request, res: Response): Promise<VideoMeta | undefined> => {
  try {
    const video_meta = await get_video_meta(req, res);
    console.log("done video meta preprocessing");
    return video_meta;
  } catch (error) {
    console.log("error is:", error);
  }
};

export default Metadata;
