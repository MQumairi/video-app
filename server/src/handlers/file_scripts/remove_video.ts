import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { FileScript } from "../../models/file_script";
import { VideoMeta } from "../../models/video_meta";

const RemoveVideo = async (req: Request, res: Response): Promise<FileScript | undefined> => {
  const id = +req.params.id;
  const file_script_repo = getRepository(FileScript);
  const script = await file_script_repo.findOne(id, { relations: ["videos"] });
  if (!script) {
    res.status(404).send({ message: "file script not found" });
    return;
  }
  const req_video: VideoMeta = req.body.video;
  const video_repo = getRepository(VideoMeta);
  const video = await video_repo.findOne(req_video);
  if (!video) {
    res.status(404).send({ message: "video not found" });
    return;
  }
  const new_videos: VideoMeta[] = [];
  for (let v of script.videos) {
    if (v.id != video.id) new_videos.push(v);
  }
  script.videos = new_videos;
  await file_script_repo.save(script);
  res.status(200).send(script);
  return script;
};

export default RemoveVideo;
