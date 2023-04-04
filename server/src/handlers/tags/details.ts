import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Tag } from "../../models/tag";
import { SearchQuery } from "../../lib/search_query";
import { VideoSearcher } from "../../lib/videos_lib/video_searcher";

const Details = async (req: Request, res: Response): Promise<Tag | undefined> => {
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
  const [videos, count] = await seacher.video_search_results();
  tag.videos = videos;
  res.status(200).send({ tag, count });
  return tag;
};

export default Details;
