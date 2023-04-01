import { exec as exec_sync } from "child_process";
import { promisify } from "util";
import { VideoMeta } from "../../models/video_meta";
import { Directory } from "../directory";
import { existsSync } from "fs";
import { Timestamper } from "../timestamper";
const exec = promisify(exec_sync);

interface VideResolution {
  width: number;
  height: number;
}

export class VideoFileProber {
  video: VideoMeta;

  constructor(video_path: string) {
    this.video = VideoMeta.create_from_path(video_path);
  }

  get_video_duration = async (): Promise<number> => {
    const v_path = this.video.path;
    if (!Directory.is_video(v_path) || !existsSync(v_path)) {
      console.log("invalid video file provided");
      return 0;
    }
    const timestamper = new Timestamper(this.video);
    return await timestamper.video_duration_seconds();
  };

  get_video_resolution = async (): Promise<VideResolution | undefined> => {
    try {
      const v_path = this.video.path;
      if (!Directory.is_video(v_path) || !existsSync(v_path)) {
        console.log("invalid video file provided");
        return undefined;
      }
      const command = `ffprobe -v error -select_streams v -show_entries stream=width,height -of json "${v_path}"`;
      const exec_res = await exec(command);
      const result_json = JSON.parse(exec_res.stdout);
      const width = result_json["streams"][0]["width"];
      const height = result_json["streams"][0]["height"];
      console.log(`${this.video.id}: width: ${width}, height: ${height}`);
      return { width: width, height: height };
    } catch (err) {
      console.log("encountered erro:", err);
    }
  };
}
