import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { DirectoryManager } from "../../models/directory_manager";
import { Playlist } from "../../models/playlist";
import Shuffler from "../../models/shuffler";

const GUI_Edit_Dir = async (req: Request, res: Response): Promise<void> => {
  let dirname = req.params.dirname;
  let directory_manager = new DirectoryManager();
  let directory_path = DirectoryManager.getDataPath() + "/" + dirname;
  let video_files = await directory_manager.listVideos(directory_path);
  let random_vid_url = await new Shuffler().directory_shuffle(directory_path);
  const playlist_repo = getRepository(Playlist);
  const playlists = await playlist_repo.find();
  res.render("edit_videos.ejs", { DIR_NAME: dirname, vids: video_files, RANDOM_VID: random_vid_url, PLAYLISTS: playlists });
};

export default GUI_Edit_Dir;
