import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Playlist } from "../../models/playlist";

const Create = async (req: Request, res: Response): Promise<Playlist | undefined> => {
  try {
    let tag: Playlist = req.body;
    const playlist_repo = getRepository(Playlist);
    await playlist_repo.save(tag);
    res.status(201).send(tag);
    return tag;
  } catch (error) {
    res.status(409).send("Failed to create Playlist, error:\n" + error);
    return undefined;
  }
};

export default Create;
