import { existsSync } from "fs";
import { VideoMeta } from "../../models/video_meta";
import { Timestamper } from "../videos_lib/timestamper";
import { exec as exec_sync } from "child_process";
import { promisify } from "util";
import ThumbnailSaver from "./thumbnail_saver";
import { getRepository } from "typeorm";
const exec = promisify(exec_sync);

export default class ThumbnailGenerator {
  // Generate thumbnail for multiple videos
  static async thumb_videos(videos: VideoMeta[]) {
    const thumbs_per_video = 3;
    for (const v of videos) {
      const video = await getRepository(VideoMeta).findOne({ where: { id: v.id }, relations: ["gallery", "thumbnail", "tags", "file_scripts"] });
      if (!video) continue;
      if (video.gallery && video.gallery.images.length >= thumbs_per_video) {
        console.log(`video already has ${video.gallery.images.length} images in its associated gallery...`);
        if (video.thumbnail) continue;
        console.log("🌅 missing thumbnail!");
        await VideoMeta.thumb_video(video, video.gallery.images[0]);
      }
      await ThumbnailGenerator.thumb_video(video, thumbs_per_video);
    }
    console.log(`✅ ✅ ✅ done generating thumb for ${videos.length} videos`);
  }

  // Generate thumbnails for one video
  static async thumb_video(video: VideoMeta, number_of_thumbs: number = 6) {
    console.log("creating thumbnail for video:", video.id);
    const timestamper = new Timestamper(video);
    await timestamper.video_markers(number_of_thumbs);
    const markers = timestamper.get_timestamps();
    const markers_sec = timestamper.get_timestamps_secs();
    const destination_paths = ThumbnailGenerator.build_thumb_paths(video, markers_sec);
    console.log("will generate thumbs out of timestamps:", markers);
    const generate_res = await ThumbnailGenerator.generate_thumbnails(video, markers, destination_paths);
    if (!generate_res) return;
    await ThumbnailGenerator.multi_thumbnail_post_process(destination_paths, video, markers_sec);
    console.log("✅ ✅ ✅ done generating thumbs");
  }

  private static build_thumb_paths(video: VideoMeta, markers_sec: number[]): string[] {
    const paths: string[] = [];
    for (let i = 0; i < markers_sec.length; i++) {
      const path = `output_${video.id}_${Math.floor(markers_sec[i])}_${i}.png`;
      paths.push(path);
    }
    return paths;
  }

  private static async generate_thumbnails(video: VideoMeta, markers: string[], destination_paths: string[]): Promise<boolean> {
    if (destination_paths.length != markers.length) return false;
    const command = ThumbnailGenerator.build_command(video, markers, destination_paths);
    try {
      await exec(command);
      return true;
    } catch (err) {
      console.log("encountered error:", err);
      return false;
    }
  }

  private static build_command(video: VideoMeta, markers: string[], destination_paths: string[]): string {
    const command_markers: string[] = [];
    const command_paths: string[] = [];
    for (let i = 0; i < markers.length; i++) {
      command_markers.push(`-ss ${markers[i]} -i "./${video.path}"`);
      command_paths.push(`-map ${i}:v -vframes 1 '${destination_paths[i]}'`);
    }
    return "ffmpeg " + command_markers.join(" ") + " " + command_paths.join(" ");
  }

  private static async multi_thumbnail_post_process(thumbnail_paths: string[], video: VideoMeta, markers_sec: number[]) {
    for (let i = 0; i < thumbnail_paths.length; i++) {
      await ThumbnailGenerator.thumbnail_post_process(thumbnail_paths[i], video, markers_sec[i]);
    }
  }

  private static async thumbnail_post_process(thumbnail_path: string, video: VideoMeta, marker_sec: number) {
    if (!existsSync(thumbnail_path)) {
      console.log(`thumbnail path ${thumbnail_path} not exist`);
      return;
    }
    console.log(`generated thumb: ${thumbnail_path}`);
    const image = await ThumbnailSaver.save_thumbnail_with_timestamp(thumbnail_path, video, marker_sec);
    if (!image || video.thumbnail) return;
    await VideoMeta.thumb_video(video, image);
  }
}
