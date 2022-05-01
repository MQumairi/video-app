import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Tag } from "../../models/tag";

const RemoveVideo = async (req: Request, res: Response): Promise<Tag | undefined> => {
  const id = +req.params.id;
  const tag_repo = getRepository(Tag);
  let found_tag = await tag_repo.findOne(id);
  if (found_tag === undefined) {
    res.status(404).send("Tag not found");
    return undefined;
  }
  const videos_to_remove: string[] = req.body.videos;
  for (let path of videos_to_remove) {
    const found_in_tag = found_tag.videos.find((v) => v.path == path);
    if (found_in_tag) {
      const index_to_remove = found_tag.videos.indexOf(found_in_tag);
      found_tag.videos.splice(index_to_remove, 1);
    }
  }
  await tag_repo.save(found_tag);
  res.status(201).send(found_tag);
  return found_tag;
};

export default RemoveVideo;
