import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Playlist } from "../../models/playlist";
import Shuffler from "../../models/shuffler";

const GUI_edit = async (req: Request, res: Response): Promise<void> => {
  const id = +req.params.id;
  let playlist = await getRepository(Playlist).findOne(id);
  if (playlist === undefined) {
    playlist = new Playlist();
    playlist.id = id;
    playlist.name = "Unfound";
    playlist.videos = [];
  }

  playlist.videos.sort((vid_a, vid_b) => {
    const name_a = vid_a.name.toUpperCase();
    const name_b = vid_b.name.toUpperCase();
    if (name_a < name_b) {
      return -1;
    }
    if (name_a > name_b) {
      return 1;
    }
    return 0;
  });

  let random_vid_url = "/playlists/" + id + (await new Shuffler().playlist_shuffle(id));
  res.render("playlists/playlist_edit.ejs", { PLAYLIST: playlist, RANDOM_VID: random_vid_url });
};

export default GUI_edit;
