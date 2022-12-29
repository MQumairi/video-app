import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { VideoScript } from "../../models/video_script";
import { ScriptManager } from "../../lib/script_manager";

const Execute = async (req: Request, res: Response): Promise<VideoScript | undefined> => {
  const id = +req.params.id;
  const script = await getRepository(VideoScript).findOne(id);
  if (!script) {
    res.status(404).send("VideoScript not found");
    return;
  }
  let command = req.body.command ?? script.command;
  command = command + ` ${process.env.SCRIPT_SECRET}`;
  console.log("command is:", command);
  console.log(`executing ${command}`);
  const cmd_res = await ScriptManager.execute(script, command);
  console.log("command result:", cmd_res);
  res.status(200).json(cmd_res);
  return script;
};

export default Execute;
