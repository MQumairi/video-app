import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Playlist } from "../../models/playlist";

const Create = async (req: Request, res: Response): Promise<Playlist | undefined> => {
  //Try to create the object
  try {
    let playlist_name = req.body.name;
    let playlist = new Playlist();
    playlist.name = playlist_name;
    const playlistRepo = getRepository(Playlist);
    await playlistRepo.save(playlist);
    res.status(200).redirect("/playlists/create");
    return playlist;
  } catch (error) {
    //Upon failure, do the following
    res.status(409).send("Failed to create Playlist, error:\n" + error);
    return undefined;
  }
};

export default Create;
