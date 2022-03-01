import { getRepository } from "typeorm";
import { DirectoryManager } from "./directory_manager";
import { Playlist } from "./playlist";
import { Video } from "./video";
import { IVideoFile } from "./video_file";

export default class Shuffler {
  async get_random_video(mode: string, dir_path: string, playlist_name = ""): Promise<string> {
    if (mode == "global") {
      return await this.global_shuffle();
    } else if (mode == "playlist") {
      return await this.playlist_shuffle(playlist_name);
    }
    return await this.directory_shuffle(dir_path);
  }

  async directory_shuffle(dir_path: string): Promise<string> {
    let directory_manager = new DirectoryManager();
    let videos = await directory_manager.listVideos(dir_path);
    let random_video = this.shuffle(videos);
    return "/" + random_video.src;
  }

  async global_shuffle(): Promise<string> {
    let videos = await getRepository(Video).find();
    let vid = this.shuffle_vid(videos);
    return vid.src;
  }

  async playlist_shuffle(playlist_name: string): Promise<string> {
    let playlist = await getRepository(Playlist).findOne({ where: { name: playlist_name } });
    if (playlist == undefined) {
      return "/";
    }
    let videos = playlist.videos;
    let vid = this.shuffle_vid(videos);
    return vid.src;
  }

  shuffle(videos: IVideoFile[]): IVideoFile {
    return videos[Math.floor(Math.random() * videos.length)];
  }

  shuffle_vid(videos: Video[]): Video {
    if (videos.length == 0) {
      let out = new Video();
      out.name = "";
      out.src = "/";
      return out;
    }
    return videos[Math.floor(Math.random() * videos.length)];
  }
}
