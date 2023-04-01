import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { FileScript } from "../../models/file_script";

const List = async (req: Request, res: Response): Promise<FileScript[]> => {
  const file_script_repo = getRepository(FileScript);
  const file_script_list = await file_script_repo.find();
  res.json(file_script_list);
  return file_script_list;
};

export default List;
