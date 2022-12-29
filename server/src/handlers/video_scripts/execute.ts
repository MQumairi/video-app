import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { VideoScript } from "../../models/video_script";
import { exec as exec_sync } from "child_process";
import { promisify } from "util";
const exec = promisify(exec_sync);

const Execute = async (req: Request, res: Response): Promise<VideoScript | undefined> => {
  const id = +req.params.id;
  const script = await getRepository(VideoScript).findOne(id);
  if (!script) {
    res.status(404).send("VideoScript not found");
    return;
  }
  const command = req.body.command ?? `./${script.command}`;
  console.log(`executing ${command}`);
  const cmd_res = await exec(command);
  console.log("command result:", cmd_res);
  res.status(200).json(cmd_res);
  return script;
};

export default Execute;
