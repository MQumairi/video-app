import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Tag } from "../../models/tag";

const Edit = async (req: Request, res: Response): Promise<Tag | undefined> => {
  const id = +req.params.id;
  const tag_repo = getRepository(Tag);
  let found_playlist = await tag_repo.findOne({ where: { id: id, is_playlist: true } });
  if (found_playlist === undefined) {
    res.status(404).send("Tag not found");
    return undefined;
  }
  found_playlist.name = req.body.name;
  await tag_repo.save(found_playlist);
  res.status(201).send(found_playlist);
  return found_playlist;
};

export default Edit;
