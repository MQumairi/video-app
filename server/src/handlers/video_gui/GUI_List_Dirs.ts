import { Request, Response } from "express";
import { DirectoryManager } from "../../models/directory_manager";

const GUI_List_Dirs = async (req: Request, res: Response): Promise<void> => {
  let directory_manager = new DirectoryManager();
  let directories = await directory_manager.listDirectories();
  res.render("index.ejs", { dirs: directories });
};

export default GUI_List_Dirs;
