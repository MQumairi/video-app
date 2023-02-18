import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { VideoMeta } from "../../models/video_meta";
import VideoTrasher from "../../lib/videos_lib/video_trasher";

const Delete = async (req: Request, res: Response): Promise<void> => {
  const id = +req.params.id;
  const video_repo = getRepository(VideoMeta);
  const video = await video_repo.findOne(id);
  if (!video) {
    res.status(404).send("Not found");
    return;
  }
  const trash_res = await VideoTrasher.trash(video);
  if (trash_res) {
    res.status(200).send({ meessage: `removed video of id ${id}` });
    return;
  }
  res.status(500).send({ meessage: `failed to remove video of id ${id}` });
};

export default Delete;
