import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Playlist } from "../../models/playlist";

const Delete = async (req: Request, res: Response): Promise<void> => {
  console.log("Entered delete");
  const id = +req.params.id;
  const playlist_Repo = getRepository(Playlist);
  const playlist_ = await playlist_Repo.findOne(id);
  if (playlist_ === undefined) res.status(404).send("Not found");
  await playlist_Repo.remove(playlist_!);
  res.redirect("/playlists");
};

export default Delete;
