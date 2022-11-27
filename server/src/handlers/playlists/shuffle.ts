import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { VideoMeta } from "../../models/video_meta";

const Shuffle = async (req: Request, res: Response): Promise<VideoMeta | undefined> => {
  const id = +req.params.id;
  const video_repo = getRepository(VideoMeta);
  const random_db_video = await video_repo
  .createQueryBuilder("video")
  .innerJoin("video.tags", "tag")
  .select()
  .where("tag.id = :tag_id", { tag_id: id })
  .andWhere("video.series_order = 1")
  .orderBy("RANDOM()")
  .getOne();
  res.status(200).send(random_db_video);
  return random_db_video;
};

export default Shuffle;
