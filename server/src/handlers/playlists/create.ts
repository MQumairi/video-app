import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Tag } from "../../models/tag";

const Create = async (req: Request, res: Response): Promise<Tag | undefined> => {
  try {
    let playlist: Tag = req.body;
    playlist.is_playlist = true;
    const tag_repo = getRepository(Tag);
    await tag_repo.save(playlist);
    res.status(201).send(playlist);
    return playlist;
  } catch (error) {
    res.status(409).send("Failed to create Playlist, error:\n" + error);
    return undefined;
  }
};

export default Create;
