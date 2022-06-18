import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Playlist } from "../../models/playlist";

const Delete = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = +req.params.id;
    console.log("deleted playlist of id:", id);
    const playlist_repo = getRepository(Playlist);
    const playlist = await playlist_repo.findOne(id);
    if (!playlist) {
      res.status(404).send("Not found");
      return;
    }
    await playlist_repo.remove(playlist);
    res.status(201);
  } catch (error: any) {
    console.log("error:", error);
  }
};

export default Delete;
