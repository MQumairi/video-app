import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Playlist } from "../../models/playlist";

const Edit = async (req: Request, res: Response): Promise<Playlist | undefined> => {
  const id = +req.params.id;
  const playlist_repo = getRepository(Playlist);
  let found_playlist = await playlist_repo.findOne(id);
  if (found_playlist === undefined) {
    res.status(404).send("Tag not found");
    return undefined;
  }
  found_playlist.name = req.body.name;
  await playlist_repo.save(found_playlist);
  res.status(201).send(found_playlist);
  return found_playlist;
};

export default Edit;
