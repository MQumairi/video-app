import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { FileScript } from "../../models/file_script";

const Details = async (req: Request, res: Response): Promise<FileScript | undefined> => {
  const id = +req.params.id;
  const script = await getRepository(FileScript).findOne(id);
  if (!script) {
    res.status(404).send("FileScript not found");
    return;
  }
  res.status(200).send(script);
  return script;
};

export default Details;
