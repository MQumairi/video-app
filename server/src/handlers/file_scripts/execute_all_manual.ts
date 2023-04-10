import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { FileScript } from "../../models/file_script";

const ExecuteAllManual = async (req: Request, res: Response): Promise<FileScript | undefined> => {
  console.log("entered ExecuteAllManual");
  const id = +req.params.id;
  const file_script_repo = getRepository(FileScript);
  const script_videos = await file_script_repo.findOne(id, { relations: ["videos"] });
  const count = { executed_videos: 0, executed_images: 0 };
  if (!script_videos) {
    res.status(404).send({ message: "file script not found" });
    return;
  }
  // Execute on each video
  for (let v of script_videos.videos) {
    await FileScript.execute_script(script_videos, `./${v.path}`);
    count.executed_videos += 1;
  }
  console.log(`finished executing on videos`);

  const script_images = await file_script_repo.findOne(id, { relations: ["images"] });
  if (!script_images) {
    res.status(404).send({ message: "file script not found" });
    return;
  }
  // Execute on each gallery
  for (let i of script_images.images) {
    await FileScript.execute_script(script_images, `./${i.path}`);
    count.executed_images += 1;
  }
  console.log(`finished executing script ${script_images.id} on all media`);
  console.log(count);
  res.status(200).send(script_images);
  return script_images;
};

export default ExecuteAllManual;
