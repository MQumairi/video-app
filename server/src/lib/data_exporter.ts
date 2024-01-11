// tags
// images & galleries
// videos ****
// persistent_queries
// playlists

import { join } from "path";
import { FileOperation } from "./file_system/file_operations";
import { VideoMeta } from "../models/video_meta";
import { Tag } from "../models/tag";
import { getRepository } from "typeorm";
import { appendFileSync, readFileSync, writeFileSync } from "fs";

interface DataObject {
  [key: string]: any;
}

export class DataExporter {
  static export_dir_name = "exported_data";
  static video_file_path = join(DataExporter.export_dir_name, "exported_videos.json");

  static async export_videos() {
    await FileOperation.create_file(DataExporter.video_file_path, "");
    const video_meta_repo = getRepository(VideoMeta);
    const video_query = video_meta_repo
      .createQueryBuilder("video")
      .addGroupBy("video.id")
      .leftJoinAndSelect("video.tags", "tag")
      .leftJoinAndSelect("video.gallery", "gallery")
      .leftJoinAndSelect("video.thumbnail", "thumbnail")
      .addGroupBy("tag.id")
      .addGroupBy("gallery.id")
      .addGroupBy("thumbnail.id")
      .orderBy("video.id");
    const vidoes = await video_query.getMany();
    for (const v of vidoes) {
      const obj = DataExporter.videoToJson(v);
      DataExporter.appendObjectToFile(DataExporter.video_file_path, obj);
    }
    DataExporter.cleanupFile(DataExporter.video_file_path);
  }

  private static videoToJson = (video: VideoMeta): DataObject => {
    console.log("video:", video.name);
    const video_object = {
      name: video.name,
      path: video.path,
      rating: video.rating,
      tags: Tag.get_names(video.tags),
      views: video.views,
      duration_sec: video.duration_sec,
      width: video.width,
      height: video.height,
      created_at: video.created_at,
      size_mb: video.size_mb,
      thumbnail: video.thumbnail ? video.thumbnail.path : null,
      gallery: video.gallery ? video.gallery.path : null,
    };
    return video_object;
  };

  private static appendObjectToFile = (filePath: string, obj: DataObject) => {
    appendFileSync(filePath, `\n${JSON.stringify(obj)},`, "utf-8");
  };

  private static cleanupFile = (filePath: string) => {
    console.log("cleaning...");
    const existingContent = readFileSync(filePath, "utf-8");
    const fileContent = existingContent.slice(0, -1);
    const newContent = "[" + fileContent + "\n]\n";
    writeFileSync(filePath, newContent, "utf-8");
    console.log("done cleaning...");
  };
}
