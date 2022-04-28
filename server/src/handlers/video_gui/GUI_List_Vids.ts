import { Request, Response } from "express";
import { DirectoryManager } from "../../models/directory_manager";
import Shuffler from "../../models/shuffler";

const GUI_List_Vids = async (req: Request, res: Response): Promise<void> => {
  let dirname = req.params.dirname;
  let directory_path = DirectoryManager.getDataPath() + "/" + dirname;
  let directory_manager = new DirectoryManager();
  let video_files = await directory_manager.listVideos(directory_path);

  let mode: string = req.query.mode?.toString() ?? "";
  let playlist: string = req.query.playlist?.toString() ?? "";
  let random_vid_url = await new Shuffler().directory_shuffle(directory_path);

  res.render("videos.ejs", { vids: video_files, RANDOM_VID: random_vid_url, DIR_NAME: dirname, MODE: mode, PLAYLIST_NAME: playlist });
};

export default GUI_List_Vids;
