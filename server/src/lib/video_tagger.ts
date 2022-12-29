import { getRepository } from "typeorm";
import { Tag } from "../models/tag";
import { VideoMeta } from "../models/video_meta";
import VideoFinder from "./video_finder";

export default class VideoTagger {
  videos: VideoMeta[];
  tags: Tag[];

  constructor(videos: VideoMeta[], tags: Tag[]) {
    this.videos = videos;
    this.tags = tags;
  }

  apply_tags_to_videos = async (): Promise<void> => {
    for (let v of this.videos) {
      let tags_set = await this.build_tags_set(this.tags);
      const finder = new VideoFinder(v.path);
      const video_to_tag = await finder.find();
      if (video_to_tag == null) return;
      console.log(`found video: ${video_to_tag.id}`);
      console.log(`applying tags to video ${video_to_tag.id}`);
      console.log(`originally has ${video_to_tag.tags.length}`);
      tags_set = this.filter_for_relevant_tags(video_to_tag, tags_set);
      const tags_to_add = await this.build_tags_list(tags_set);
      console.log(`adding ${tags_to_add.length} tags`);
      const new_tags = video_to_tag.tags.concat(tags_to_add);
      console.log(`new tags: ${new_tags.length}`);
      video_to_tag.tags = new_tags;
      await getRepository(VideoMeta).save(video_to_tag);
      console.log(`Done applying tags to video ${video_to_tag.id}`);
    }
  };

  remove_tags_from_videos = async (): Promise<void> => {
    for (let v of this.videos) {
      const finder = new VideoFinder(v.path);
      const video_to_untag = await finder.find();
      if (video_to_untag == null) return;
      console.log(`removing tags from video ${video_to_untag.id}`);
      console.log(`originally has ${video_to_untag.tags.length} tags`);
      const tags_to_remove_set = await this.build_tags_set(this.tags, false);
      console.log(`removing ${tags_to_remove_set.size} tags`);
      const new_tags = this.remove_tags(video_to_untag, tags_to_remove_set);
      console.log(`new tags: ${new_tags.length}`);
      video_to_untag.tags = new_tags;
      await getRepository(VideoMeta).save(video_to_untag);
      console.log(`Done removing from video ${video_to_untag.id}`);
    }
  };

  build_tags_set = async (tags: Tag[], include_children: boolean = true): Promise<Set<string>> => {
    const tags_set = new Set<string>();
    const tag_repo = getRepository(Tag);
    for (let t of tags) {
      const found_tag = await tag_repo.findOne({ where: { name: t.name }, relations: ["child_tags"] });
      if (found_tag) {
        tags_set.add(found_tag.name);
        if (!found_tag.child_tags) found_tag.child_tags = [];
        if (!include_children) continue;
        for (let child_tag of found_tag.child_tags) {
          tags_set.add(child_tag.name);
        }
      }
    }
    return tags_set;
  };

  build_tags_list = async (tag_set: Set<string>): Promise<Tag[]> => {
    const tags: Tag[] = [];
    const tags_arr = Array.from(tag_set);
    for (let t_name of tags_arr) {
      const tag_repo = getRepository(Tag);
      const t = await tag_repo.findOne({ where: { name: t_name }, relations: ["child_tags"] });
      if (t) tags.push(t);
    }
    return tags;
  };

  filter_for_relevant_tags = (video: VideoMeta, tags_set: Set<string>): Set<string> => {
    for (let t of video.tags) {
      if (tags_set.has(t.name)) {
        tags_set.delete(t.name);
      }
    }
    return tags_set;
  };

  remove_tags = (video: VideoMeta, tags_to_remove: Set<string>): Tag[] => {
    const out: Tag[] = [];
    for (let tag of video.tags) {
      if (!tags_to_remove.has(tag.name)) out.push(tag);
    }
    return out;
  };
}
