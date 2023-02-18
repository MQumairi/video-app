import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { FileScript } from "../../models/file_script";
import { VideoMeta } from "../../models/video_meta";

const ExecuteManualVideo = async (req: Request, res: Response): Promise<FileScript | undefined> => {
  const id = +req.params.id;
  const file_script_repo = getRepository(FileScript);
  const script = await file_script_repo.findOne(id);
  if (!script) {
    res.status(404).send({ message: "file script not found" });
    return;
  }
  console.log(`found script: ${script.id}`);
  const req_video = req.body.video;
  const video_repo = getRepository(VideoMeta);
  const video = await video_repo.findOne(req_video.id);
  if (!video) {
    res.status(404).send({ message: "video not found" });
    return;
  }
  console.log(`found video: ${video.id}`);
  await FileScript.execute_script(script, `./${video.path}`);
  res.status(200).send(script);
  return script;
};

export default ExecuteManualVideo;
