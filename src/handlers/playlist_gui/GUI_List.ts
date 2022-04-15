import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Playlist } from "../../models/playlist";

const GUI_List = async (req: Request, res: Response): Promise<void> => {
  const playlist_repo = getRepository(Playlist);
  const playlists = await playlist_repo.find({ order: { name: "ASC" } });
  res.render("playlists/playlist_list.ejs", { PLAYLISTS: playlists });
};

export default GUI_List;
