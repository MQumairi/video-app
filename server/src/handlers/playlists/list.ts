import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Playlist } from "../../models/playlist";

const List = async (req: Request, res: Response): Promise<Playlist[]> => {
  console.log("entered Playlist.list");
  const playlist_repo = getRepository(Playlist);
  const playlists = await playlist_repo.find({ order: { name: "ASC" } });
  res.status(200).json(playlists);
  return playlists;
};

export default List;
