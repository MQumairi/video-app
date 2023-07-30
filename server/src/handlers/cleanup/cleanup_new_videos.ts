import { Request, Response } from "express";
import { VideoMeta } from "../../models/video_meta";
import { In, getRepository } from "typeorm";
import { Tag } from "../../models/tag";
import VideoTagger from "../../lib/videos_lib/video_tagger";
import { FileBatcher } from "../../lib/file_batcher";
import { Directory } from "../../lib/directory";

const ProcessVideoFilePaths = async (paths: string[]): Promise<boolean> => {
  const missing_file_paths = await FindMissingFilePaths(paths);
  if (missing_file_paths.length === 0) return true;
  for (const video_path of missing_file_paths) await ProcessVideo(video_path);
  return true;
};

const FindMissingFilePaths = async (paths: string[]): Promise<string[]> => {
  const video_repo = getRepository(VideoMeta);
  const found_videos = await video_repo.find({ where: { path: In(paths) } });
  if (found_videos.length === paths.length) return [];
  const file_paths_set = new Set(paths);
  for (const v of found_videos) {
    if (file_paths_set.has(v.path)) file_paths_set.delete(v.path);
  }
  return Array.from(file_paths_set);
};

const ProcessVideo = async (video_path: string): Promise<void> => {
  console.log("processing new video path:", video_path);
  // Create video from path
  const video = VideoMeta.create_from_path(video_path);
  // Save video if it doesn't exist
  const video_repo = getRepository(VideoMeta);
  let found_video = await video_repo.findOne({ where: { path: video.path } });
  if (!found_video) found_video = await VideoMeta.save_new_video(video.path);
  // Apply Tags
  const video_tags = await SaveDirTags(found_video);
  const video_tagger = new VideoTagger([found_video!], video_tags);
  await video_tagger.apply_tags_to_videos();
};

const SaveDirTags = async (video: VideoMeta): Promise<Tag[]> => {
  const parent_dirs = video.parent_path.split("/");
  const tag_repo = getRepository(Tag);
  const tags: Tag[] = [];
  for (let dir_name of parent_dirs) {
    let found_tag = await tag_repo.findOne({ where: { name: dir_name } });
    if (!found_tag) {
      console.log(`a tag named ${dir_name} doesn't exist. Creating.`);
      let tag = new Tag();
      tag.name = dir_name;
      found_tag = await tag_repo.save(tag);
    }
    tags.push(found_tag);
  }
  return tags;
};

const CleanupNewVideos = async (req: Request, res: Response): Promise<void> => {
  console.log("Finding new video files to add to database");
  const file_batcher = new FileBatcher("videos", Directory.video_extensions);
  await file_batcher.execute_handler(ProcessVideoFilePaths);
  console.log("Done adding new videos");
  res.status(200).json({ message: "done" });
};

export default CleanupNewVideos;
