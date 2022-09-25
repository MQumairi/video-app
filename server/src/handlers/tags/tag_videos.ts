import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Tag } from "../../models/tag";
import { VideoMeta } from "../../models/video_meta";
import { existsSync } from "fs";

const build_tag_set = (tags: Tag[]): Set<string> => {
  const tags_set = new Set<string>();
  for (let t of tags) {
    tags_set.add(t.name);
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
    console.log("new vid:", found_video);
  }
  return found_video;
};

const build_tags_to_add = async (tag_set: Set<string>): Promise<Tag[]> => {
  const tags: Tag[] = [];
  const tags_arr = Array.from(tag_set);
  for (let t_name of tags_arr) {
    const tag_repo = getRepository(Tag);
    const t = await tag_repo.findOne({ where: { name: t_name } });
    if (t) tags.push(t);
  }
  return tags;
};

const TagVideos = async (req: Request, res: Response): Promise<void> => {
  console.log("entered tag vides");
  const videos: VideoMeta[] = req.body.videos;
  console.log("videos:", videos.length);
  const tags: Tag[] = req.body.tags;
  console.log("tags:", tags.length);
  videos.forEach(async (v) => {
    const tags_set = build_tag_set(tags);
    console.log("tags_set is", tags_set.size);
    console.log("looping through video (id):", v.id);
    const video_to_tag = await find_video(v.path);
    if (video_to_tag == null) return;
    console.log("looping through video (id):", v.id);
    console.log("orignal tags:", video_to_tag.tags.length);
    for (let t of video_to_tag.tags) {
      if (tags_set.has(t.name)) {
        tags_set.delete(t.name);
      }
    }
    const tags_to_add = await build_tags_to_add(tags_set);
    const new_tags = video_to_tag.tags.concat(tags_to_add);
    console.log("new tags:", new_tags.length);
    video_to_tag.tags = new_tags;
    await getRepository(VideoMeta).save(video_to_tag);
  });
  res.status(200).json({ message: "done" });
};

export default TagVideos;
