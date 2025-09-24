import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { FileScript } from "../../models/file_script";

const ExecuteGlobal = async (req: Request, res: Response): Promise<FileScript | undefined> => {
  console.log("executing global script");
  const id = +req.params.id;
  const file_script_repo = getRepository(FileScript);
  const script = await file_script_repo.findOne(id);
  if (!script || !script.is_global_script) {
    res.status(404).send({ message: "file script not found" });
    return;
  }
  console.log("executing global script: ", script.name);
  const args = req.body.args ?? "";
  await FileScript.execute_script(script, args);
  res.status(200).send(script);
  return script;
};

export default ExecuteGlobal;
