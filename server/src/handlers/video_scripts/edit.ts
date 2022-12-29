import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { VideoScript } from "../../models/video_script";

const Edit = async (req: Request, res: Response): Promise<VideoScript | undefined> => {
  const id = +req.params.id;
  const script_repo = getRepository(VideoScript);
  let found_script = await script_repo.findOne(id);
  if (!found_script) {
    res.status(404).send("VideoScript not found");
    return;
  }
  console.log("req body:", req.body);
  found_script.command = req.body.command ?? found_script.command;
  found_script.auto_exec_on_start = req.body.auto_exec ?? found_script.auto_exec_on_start;
  await script_repo.save(found_script!);
  res.status(201).send(found_script);
  return found_script;
};

export default Edit;
