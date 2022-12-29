import { getRepository } from "typeorm";
import { VideoScript } from "../models/video_script";
import { exec as exec_sync } from "child_process";
import { promisify } from "util";
const exec = promisify(exec_sync);

class ICommandRes {
  stdout: string;
  stderr: string;
}

export class ScriptManager {
  static async create_script(video_script: VideoScript) {
    const script_repo = getRepository(VideoScript);
    let found_script = await script_repo.findOne({ relations: ["videos"], where: { path: video_script.path } });
    if (found_script) return;
    try {
      let saved_script = await script_repo.save(video_script);
      console.log("saved script:", saved_script);
    } catch (error) {
      console.log("encounterde error:", error);
    }
  }

  static async create_scripts(video_scripts: VideoScript[]) {
    for (const s of video_scripts) {
      await ScriptManager.create_script(s);
    }
  }

  static async execute(video_script: VideoScript, exec_command: string | null = null): Promise<ICommandRes> {
    const command = `./${exec_command}` ?? `./${video_script.command}`;
    console.log(`executing ${video_script.name}`);
    return await exec(command);
  }
}
