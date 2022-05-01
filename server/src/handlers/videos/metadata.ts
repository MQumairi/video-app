import { Request, Response } from "express";
import { VideoMeta } from "../../models/video_meta";
import { Directory } from "../../models/directory";
import { not_found_error } from "../../app";

const Metadata = async (req: Request, res: Response): Promise<VideoMeta | undefined> => {
  //Determine that video path is valid
  const vid_path = req.params.filepath;
  if (!Directory.is_video(vid_path)) {
    res.status(404).send(not_found_error);
    return undefined;
  }
  let vid_meta = new VideoMeta(vid_path);
  res.status(200).send(vid_meta);
  return vid_meta;
};

export default Metadata;
