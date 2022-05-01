import { Request, Response } from "express";
import { Directory } from "../../models/directory";
import { not_found_error } from "../../app";

const Browse = async (req: Request, res: Response): Promise<Directory | undefined> => {
  const dir_path = req.params.filepath;
  let directory = await Directory.from_path(dir_path);
  if (directory) {
    res.status(200).send(directory);
    return directory;
  }
  res.status(404).send(not_found_error);
  return undefined;
};

export default Browse;
