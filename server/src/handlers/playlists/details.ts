import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Playlist } from "../../models/playlist";

const Details = async (req: Request, res: Response): Promise<Playlist | undefined> => {
  const id = +req.params.id;
  const playlist_repo = getRepository(Playlist);
  const playlist = await playlist_repo.findOne({ relations: ["videos"], where: { id: id } });
  if (playlist === undefined) {
    res.status(404).send("Playlist not found");
    return undefined;
  }
  res.status(200).send(playlist);
  return playlist;
};

export default Details;
