import { Request, Response } from "express";
import { VideoMeta } from "../../models/video_meta";
import LibraryIterator from "../../lib/library_iterator";
import { getRepository } from "typeorm";
import { Tag } from "../../models/tag";
import VideoTagger from "../../lib/videos_lib/video_tagger";

const CleanupNewVideos = async (req: Request, res: Response): Promise<void> => {
  console.log("Applying tags to all videos based on their path");
  await LibraryIterator.iterate_videos(process_video);
  console.log("done tagging videos");
  res.status(200).json({ message: "done" });
};

const process_video = async (video: VideoMeta): Promise<void> => {
  // Save video if it doesn't exist
  const video_repo = getRepository(VideoMeta);
  let found_video = await video_repo.findOne({ where: { path: video.path } });
  if (!found_video) found_video = await VideoMeta.save_new_video(video.path);
  // Apply Tags
  const video_tags = await save_dir_tags(found_video);
  const video_tagger = new VideoTagger([found_video!], video_tags);
  await video_tagger.apply_tags_to_videos();
};

const save_dir_tags = async (video: VideoMeta): Promise<Tag[]> => {
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

export default CleanupNewVideos;
