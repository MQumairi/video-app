import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Tag } from "../../models/tag";
import { VideoMeta } from "../../models/video_meta";
import get_random_int from "../../util/shuffle_method";

const Shuffle = async (req: Request, res: Response): Promise<VideoMeta | undefined> => {
  const id = +req.params.id;
  const tag_repo = getRepository(Tag);
  const tag = await tag_repo.findOne({ relations: ["videos"], where: { id: id } });
  if (!tag) {
    res.status(404).send("Tag not found");
    return undefined;
  }
  const videos = tag.videos;
  const random_index = get_random_int(videos.length);
  const random_video = videos[random_index];
  res.status(200).send(random_video);
  return random_video;
};

export default Shuffle;
