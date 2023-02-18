import { existsSync } from "fs";
import { VideoMeta } from "../../models/video_meta";
import { getRepository } from "typeorm";

export default class VideoFinder {
  check_file_system: boolean = true;
  check_database: boolean = true;
  path: string;

  constructor(path: string) {
    this.path = path;
  }

  find = async (): Promise<VideoMeta> => {
    this.file_system_check();
    let video = VideoMeta.create_from_path(this.path);
    if (this.check_database) {
      video = await this.database_check(video);
    }
    if (!video.tags) video.tags = [];
    return video;
  };

  file_system_check = () => {
    if (this.check_file_system && !existsSync(this.path)) {
      throw "File doesn't exist";
    }
  };

  database_check = async (video_file: VideoMeta) => {
    const video_repo = getRepository(VideoMeta);
    let found_video = await video_repo.findOne({ where: { path: video_file.path }, relations: ["tags", "gallery"] });
    if (!found_video) {
      console.log("video not found creating...");
      found_video = await video_repo.save(video_file);
      console.log("new vid:", found_video.id);
    }
    if (found_video.tags == null) {
      found_video.tags = [];
    }
    console.log("found video with tags:", found_video.tags.length);
    return found_video;
  };
}
