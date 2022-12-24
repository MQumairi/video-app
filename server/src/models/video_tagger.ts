import { getRepository } from "typeorm";
import { Tag } from "./tag";
import { VideoMeta } from "./video_meta";
import VideoFinder from "./video_finder";

export default class VideoTagger {
  videos: VideoMeta[];
  tags: Tag[];

  constructor(videos: VideoMeta[], tags: Tag[]) {
    this.videos = videos;
    this.tags = tags;
  }

  apply_tags_to_videos = async (): Promise<void> => {
    this.videos.forEach(async (v) => {
      const tags_set = await this.build_tag_set(this.tags);
      const finder = new VideoFinder(v.path);
      const video_to_tag = await finder.find();
      if (video_to_tag == null) return;
      for (let t of video_to_tag.tags) {
        if (tags_set.has(t.name)) {
          tags_set.delete(t.name);
        }
      }
      const tags_to_add = await this.build_tags_to_add(tags_set);
      console.log("tags to add:", tags_to_add.length);
      const new_tags = video_to_tag.tags.concat(tags_to_add);
      console.log("new tags:", new_tags.length);
      video_to_tag.tags = new_tags;
      await getRepository(VideoMeta).save(video_to_tag);
    });
  };

  build_tag_set = async (tags: Tag[]): Promise<Set<string>> => {
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

  build_tags_to_add = async (tag_set: Set<string>): Promise<Tag[]> => {
    const tags: Tag[] = [];
    const tags_arr = Array.from(tag_set);
    for (let t_name of tags_arr) {
      const tag_repo = getRepository(Tag);
      const t = await tag_repo.findOne({ where: { name: t_name }, relations: ["child_tags"] });
      if (t) tags.push(t);
    }
    return tags;
  };
}
