import { Request, Response } from "express";
import { DirectoryManager } from "../../models/directory_manager";

const GUI_Vid = async (req: Request, res: Response): Promise<void> => {
  let dirname = req.params.dirname;
  let vidname = req.params.vidname;
  let directory_manager = new DirectoryManager();
  let directory_path = DirectoryManager.getDataPath() + "/" + dirname;
  let random_video = await directory_manager.randomVideo(directory_path);
  res.render("video.ejs", { DIR_NAME: dirname, VID_NAME: vidname, RANDOM_VID: random_video });
};

export default GUI_Vid;
