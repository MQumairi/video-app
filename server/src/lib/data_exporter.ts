// tags ****
// galleries ****
// videos ****
// persistent_queries
// playlists

import { join } from "path";
import { FileOperation } from "./file_system/file_operations";
import { VideoMeta } from "../models/video_meta";
import { Tag } from "../models/tag";
import { getRepository } from "typeorm";
import { appendFileSync, readFileSync, writeFileSync } from "fs";
import { ImageGallery } from "../models/image_gallery";

interface DataObject {
  [key: string]: any;
}

export class DataExporter {
  static export_dir_name = "exported_data";

  static async export_videos() {
    const file_path = join(DataExporter.export_dir_name, "exported_videos.json");
    await FileOperation.create_file(file_path, "");
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
      DataExporter.appendObjectToFile(file_path, obj);
    }
    DataExporter.cleanupFile(file_path);
  }

  static async export_tags() {
    const file_path = join(DataExporter.export_dir_name, "exported_tags.json");
    await FileOperation.create_file(file_path, "");
    const tag_repo = getRepository(Tag);
    const tags_query = tag_repo
      .createQueryBuilder("tag")
      .addGroupBy("tag.id")
      .leftJoinAndSelect("tag.child_tags", "child_tag")
      .addGroupBy("child_tag.id")
      .orderBy("tag.id");
    const tags = await tags_query.getMany();
    for (const t of tags) {
      const obj = DataExporter.tagToJson(t);
      DataExporter.appendObjectToFile(file_path, obj);
    }
    DataExporter.cleanupFile(file_path);
  }

  static async export_galleries() {
    const file_path = join(DataExporter.export_dir_name, "exported_galleries.json");
    await FileOperation.create_file(file_path, "");
    const gallery_repo = getRepository(ImageGallery);
    const gallery_query = gallery_repo
      .createQueryBuilder("image_gallery")
      .addGroupBy("image_gallery.id")
      .leftJoinAndSelect("image_gallery.tags", "tag")
      .leftJoinAndSelect("image_gallery.thumbnail", "thumbnail")
      .addGroupBy("tag.id")
      .addGroupBy("thumbnail.id")
      .orderBy("image_gallery.id");
    const galleries = await gallery_query.getMany();
    for (const g of galleries) {
      const obj = DataExporter.galleryToJson(g);
      DataExporter.appendObjectToFile(file_path, obj);
    }
    DataExporter.cleanupFile(file_path);
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

  private static tagToJson = (tag: Tag): DataObject => {
    console.log("tag:", tag.name);
    const tag_object = {
      name: tag.name,
      is_character: tag.is_character,
      is_series: tag.is_series,
      is_studio: tag.is_studio,
      default_excluded: tag.default_excluded,
      default_hidden: tag.default_hidden,
      child_tags: Tag.get_names(tag.child_tags),
    };
    return tag_object;
  };

  private static galleryToJson = (gallery: ImageGallery): DataObject => {
    console.log("gallery:", gallery.name);
    const gallery_object = {
      name: gallery.name,
      path: gallery.path,
      thumbnail: gallery.thumbnail ? gallery.thumbnail.path : null,
      tags: Tag.get_names(gallery.tags),
    };
    return gallery_object;
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
