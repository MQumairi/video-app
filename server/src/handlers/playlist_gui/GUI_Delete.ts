import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Playlist } from "../../models/playlist";

const GUI_Delete = async (req: Request, res: Response): Promise<void> => {
    const id = +req.params.id;
    let playlist = await getRepository(Playlist).findOne(id);
    if (playlist === undefined) {
      playlist = new Playlist();
      playlist.id = id;
      playlist.name = "Unfound";
      playlist.videos = [];
    }
  res.render("playlists/playlist_delete.ejs", { PLAYLIST: playlist });
};

export default GUI_Delete;
