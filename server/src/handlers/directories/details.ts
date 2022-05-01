import { Request, Response } from "express";
import { Directory } from "../../models/directory";

const Details = async (req: Request, res: Response): Promise<Directory | undefined> => {
  const dir_path = req.params.filepath;
  let directory = await Directory.from_path(dir_path);
  if (directory) {
    res.status(200).send(directory);
    return directory;
  }
  res.status(200).send(directory);
  return directory;
};

export default Details;
