import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Tag } from "../../models/tag";
import { VideoMeta } from "../../models/video_meta";
import { existsSync } from "fs";

const build_tag_set = async (tags: Tag[]): Promise<Set<string>> => {
  const tags_set = new Set<string>();
  const tag_repo = getRepository(Tag);
  for (let t of tags) {
    const found_tag = await tag_repo.findOne({ where: { name: t.name }, relations: ["child_tags"] });
    if (found_tag) {
      tags_set.add(found_tag.name);
      if (!found_tag.child_tags) found_tag.child_tags = [];
      for (let child_tag of found_tag.child_tags) {
        tags_set.add(child_tag.name);
      }
    }
  }
  return tags_set;
};

const find_video = async (path: string): Promise<VideoMeta | null> => {
  if (!existsSync(path)) {
    console.log("file doesn't exist");
    return null;
  }
  const video_repo = getRepository(VideoMeta);
  let found_video = await video_repo.findOne({ where: { path: path }, relations: ["tags"] });
  if (!found_video) {
    console.log("video not found creating...");
    found_video = await video_repo.save(new VideoMeta(path));
    console.log("new vid:", found_video.id);
  }
  if (found_video.tags == null) {
    found_video.tags = [];
  }
  console.log("found video with tags:", found_video.tags.length);
  return found_video;
};

const build_tags_to_add = async (tag_set: Set<string>): Promise<Tag[]> => {
  const tags: Tag[] = [];
  const tags_arr = Array.from(tag_set);
  for (let t_name of tags_arr) {
    const tag_repo = getRepository(Tag);
    const t = await tag_repo.findOne({ where: { name: t_name }, relations: ["child_tags"] });
    if (t) tags.push(t);
  }
  return tags;
};

export const apply_tags_to_videos = async (videos: VideoMeta[], tags: Tag[]): Promise<void> => {
  videos.forEach(async (v) => {
    const tags_set = await build_tag_set(tags);
    console.log("tags_set size:", tags_set.size);
    const video_to_tag = await find_video(v.path);
    if (video_to_tag == null) return;
    for (let t of video_to_tag.tags) {
      if (tags_set.has(t.name)) {
        tags_set.delete(t.name);
      }
    }
    const tags_to_add = await build_tags_to_add(tags_set);
    console.log("tags to add:", tags_to_add.length);
    const new_tags = video_to_tag.tags.concat(tags_to_add);
    console.log("new tags:", new_tags.length);
    video_to_tag.tags = new_tags;
    await getRepository(VideoMeta).save(video_to_tag);
  });
};

const TagVideos = async (req: Request, res: Response): Promise<void> => {
  console.log("entered tag videos");
  const videos: VideoMeta[] = req.body.videos;
  console.log("videos:", videos.length);
  const tags: Tag[] = req.body.tags;
  console.log("tags:", tags.length);
  try {
    console.log("applying tags");
    await apply_tags_to_videos(videos, tags);
    res.status(200).json({ message: "done" });
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({ error: "error tagging video" });
  }
};

export default TagVideos;
