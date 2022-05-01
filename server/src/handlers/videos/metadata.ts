import { Request, Response } from "express";
import { VideoMeta } from "../../models/video_meta";
import { Directory } from "../../models/directory";
import { not_found_error } from "../../app";
import { getRepository } from "typeorm";

const Metadata = async (req: Request, res: Response): Promise<VideoMeta | undefined> => {
  //Determine that video path is valid
  const vid_path = req.params.filepath;
  if (!Directory.is_video(vid_path)) {
    res.status(404).send(not_found_error);
    return undefined;
  }
  let vid_meta = new VideoMeta(vid_path);
  // Check if video is in database for any additional meta-data
  const video_repo = getRepository(VideoMeta);
  // const vido_query = video_repo.createQueryBuilder("video_meta").leftJoinAndSelect("video_meta.tags", "tag").where({ name: vid_meta.name });
  // const found_video = await vido_query.getOne();
  const found_video = await video_repo.findOne({ relations: ["tags"], where: { name: vid_meta.name } });
  if (found_video) {
    console.log("going to send found video", found_video);
    res.status(200).send(found_video);
    return found_video;
  }
  // Otherwise if video is not found, send from browser
  console.log("going to send browser video", vid_meta);
  res.status(200).send(vid_meta);
  return vid_meta;
};

export default Metadata;
