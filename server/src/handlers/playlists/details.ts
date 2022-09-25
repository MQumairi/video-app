import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Tag } from "../../models/tag";

const Details = async (req: Request, res: Response): Promise<Tag | undefined> => {
  const id = +req.params.id;
  const tag_repo = getRepository(Tag);
  const playlist = await tag_repo.findOne({ relations: ["videos"], where: { id: id, is_playlist: true } });
  if (!playlist) {
    res.status(404).send("Playlist not found");
    return undefined;
  }
  res.status(200).send(playlist);
  return playlist;
};

export default Details;
