import { Request, Response } from "express";
import fs from "fs/promises";
import { DirectoryManager } from "../../models/directory_manager";

const ListDirs = async (req: Request, res: Response): Promise<string[]> => {
  let directory_manager = new DirectoryManager();
  let dirs = await directory_manager.listDirectories();
  res.json(dirs);
  return [];
};

export default ListDirs;
