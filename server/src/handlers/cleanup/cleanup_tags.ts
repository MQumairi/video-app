import { Request, Response } from "express";
import { VideoMeta } from "../../models/video_meta";
import LibraryIterator from "../../models/library_iterator";
import { getRepository } from "typeorm";
import { Tag } from "../../models/tag";
import VideoTagger from "../../models/video_tagger";

const CleanupTags = async (req: Request, res: Response): Promise<void> => {
  await LibraryIterator.iterate(apply_tags);
  res.status(200).json({ message: "done" });
};

const apply_tags = async (video: VideoMeta): Promise<void> => {
  console.log("video name is:", video.name);
  const video_repo = getRepository(VideoMeta);
  let found_video = await video_repo.findOne({ where: { path: video.path } });
  if (!found_video) {
    found_video = await video_repo.save(video);
  }
  const parent_dirs = found_video.parent_path.split("/");
  const tag_repo = getRepository(Tag);

  for (let dir_name of parent_dirs) {
    let found_tag = await tag_repo.findOne({ where: { name: dir_name } });
    if (!found_tag) {
      console.log(`a tag named ${dir_name} doesn't exist. Creating.`);
      let tag = new Tag();
      tag.name = dir_name;
      found_tag = await tag_repo.save(tag);
    }
    const video_tagger = new VideoTagger([found_video!], [found_tag]);
    await video_tagger.apply_tags_to_videos();
  }
};

export default CleanupTags;
