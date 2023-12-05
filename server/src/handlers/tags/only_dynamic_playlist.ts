import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Tag } from "../../models/tag";

const DynamicPlaylists = async (req: Request, res: Response): Promise<Tag[]> => {
  const tag_repo = getRepository(Tag);
  const dynamic_playlists = await tag_repo.find({ where: { is_dynamic_playlist: true }, order: { name: "ASC" } });
  res.json(dynamic_playlists);
  return dynamic_playlists;
};

export default DynamicPlaylists;