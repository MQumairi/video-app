import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Playlist } from "../../models/playlist";
import Shuffler from "../../models/shuffler";

const GUI_Details = async (req: Request, res: Response): Promise<void> => {
  const id = +req.params.id;
  let playlist = await getRepository(Playlist).findOne(id);
  if (playlist === undefined) {
    playlist = new Playlist();
    playlist.id = id;
    playlist.name = "Unfound";
    playlist.videos = [];
  }

  let mode: string = "playlist";
  let random_vid_url = await new Shuffler().get_random_video(mode, "/", playlist.name);

  res.render("playlist_details.ejs", { PLAYLIST: playlist, RANDOM_VID: random_vid_url, MODE: mode, PLAYLIST_NAME: playlist.name });
};

export default GUI_Details;
