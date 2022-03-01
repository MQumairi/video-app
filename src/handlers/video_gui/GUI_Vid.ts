import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { DirectoryManager } from "../../models/directory_manager";
import { Playlist } from "../../models/playlist";
import Shuffler from "../../models/shuffler";

const GUI_Vid = async (req: Request, res: Response): Promise<void> => {
  let dirname = req.params.dirname;
  let vidname = req.params.vidname;

  let directory_path = DirectoryManager.getDataPath() + "/" + dirname;

  let mode: string = req.query.mode?.toString() ?? "";
  let playlist: string = req.query.playlist?.toString() ?? "";
  let random_vid_url = await new Shuffler().directory_shuffle(directory_path);

  const playlist_repo = getRepository(Playlist);
  const playlists = await playlist_repo.find();
  res.render("video.ejs", { DIR_NAME: dirname, VID_NAME: vidname, RANDOM_VID: random_vid_url, PLAYLISTS: playlists, MODE: mode, PLAYLIST_NAME: playlist });
};

export default GUI_Vid;
