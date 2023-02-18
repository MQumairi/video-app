import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { FileScript } from "../../models/file_script";

const Edit = async (req: Request, res: Response): Promise<FileScript | undefined> => {
  const id = +req.params.id;
  const file_script_repo = getRepository(FileScript);
  const script = await file_script_repo.findOne(id);
  if (!script) {
    res.status(404).send({ message: "file script not found" });
    return;
  }
  console.log("script before:", script);
  const req_script: FileScript = req.body.script;
  script.name = req_script.name ?? script.name;
  if (req_script.is_manual_script) FileScript.make_manual_script(script);
  if (req_script.is_global_script) FileScript.make_global_script(script);
  if (req_script.is_start_script) FileScript.make_start_script(script);
  console.log("script after:", script);
  await file_script_repo.save(script);
  res.status(200).send(script);
  return script;
};

export default Edit;
