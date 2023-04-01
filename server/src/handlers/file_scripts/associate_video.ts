import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { FileScript } from "../../models/file_script";
import { VideoMeta } from "../../models/video_meta";

const AssociateVideo = async (req: Request, res: Response): Promise<FileScript | undefined> => {
  const id = +req.params.id;
  const file_script_repo = getRepository(FileScript);
  const script = await file_script_repo.findOne(id);
  if (!script || script.is_global_script) {
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
  await FileScript.associate_script_to_video(script, video);
  res.status(200).send(script);
  return script;
};

export default AssociateVideo;
