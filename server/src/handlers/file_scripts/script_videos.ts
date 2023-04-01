import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { FileScript } from "../../models/file_script";
import { VideoMeta } from "../../models/video_meta";

const ScriptVideos = async (req: Request, res: Response): Promise<VideoMeta[]> => {
  const id = +req.params.id;
  const script = await getRepository(FileScript).findOne(id, { relations: ["videos"] });
  if (!script) {
    res.status(404).send("FileScript not found");
    return [];
  }
  res.status(200).send(script.videos);
  return script.videos;
};

export default ScriptVideos;
