import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { FileScript } from "../../models/file_script";

const ExecuteAllManual = async (req: Request, res: Response): Promise<FileScript | undefined> => {
  console.log("entered ExecuteAllManual");
  const id = +req.params.id;
  const file_script_repo = getRepository(FileScript);
  const script = await file_script_repo.findOne(id, { relations: ["videos", "images"] });
  const count = { executed_videos: 0, executed_images: 0 };
  if (!script) {
    res.status(404).send({ message: "file script not found" });
    return;
  }
  // Execute on each video
  for (let v of script.videos) {
    await FileScript.execute_script(script, `./${v.path}`);
    count.executed_videos += 1;
  }
  console.log(`finished executing on videos`);
  // Execute on each gallery
  for (let i of script.images) {
    await FileScript.execute_script(script, `./${i.path}`);
    count.executed_images += 1;
  }
  console.log(`finished executing script ${script.id} on all media`);
  console.log(count);
  res.status(200).send(script);
  return script;
};

export default ExecuteAllManual;
