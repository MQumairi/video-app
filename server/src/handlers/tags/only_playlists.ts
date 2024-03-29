import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Tag } from "../../models/tag";

const Playlists = async (req: Request, res: Response): Promise<Tag[]> => {
  const tag_repo = getRepository(Tag);
  const playlists = await tag_repo.find({ where: { is_playlist: true }, order: { name: "ASC" } });
  res.json(playlists);
  return playlists;
};

export default Playlists;