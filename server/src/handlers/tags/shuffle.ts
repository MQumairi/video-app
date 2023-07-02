import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Tag } from "../../models/tag";
import { VideoMeta } from "../../models/video_meta";
import { SearchQuery } from "../../lib/search_query";
import { VideoSearcher } from "../../lib/videos_lib/video_searcher";

const Shuffle = async (req: Request, res: Response): Promise<VideoMeta | undefined> => {
  console.log("entered tag details");
  const id = +req.params.id;
  const tag_repo = getRepository(Tag);
  const tag = await tag_repo.findOne(id, { relations: ["child_tags"] });
  if (!tag) {
    res.status(404).send("Tag not found");
    return undefined;
  }
  const query = await SearchQuery.from_tag(req, tag);
  const seacher = new VideoSearcher(query);
  const random_video = await seacher.random_single_video();
  res.status(200).send(random_video);
  return random_video;
};

export default Shuffle;
