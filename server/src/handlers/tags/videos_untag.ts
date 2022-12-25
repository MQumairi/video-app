import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Tag } from "../../models/tag";
import { VideoMeta } from "../../models/video_meta";

const UntagVideos = async (req: Request, res: Response): Promise<Tag | undefined> => {
  console.log("entered untag videos");
  const tag: Tag = req.body.tag;
  console.log(`tag id ${tag.id}`);
  const videos_to_remove: VideoMeta[] = req.body.videos;
  console.log(`videos to remove ${videos_to_remove.length}`);
  const tag_repo = getRepository(Tag);
  let found_tag = await tag_repo.findOne(tag.id);
  if (found_tag === undefined) {
    console.log("tag not found");
    res.status(404).send("Tag not found");
    return undefined;
  }
  const video_repo = getRepository(VideoMeta);
  for (let received_video of videos_to_remove) {
    console.log(`checking for received video of id ${received_video.id}`);
    let found_video = await video_repo.findOne({ relations: ["tags"], where: { id: received_video.id } });
    if (!found_video) continue;
    console.log("video found");
    let video_tags = found_video.tags;
    video_tags = video_tags.filter(function (t) {
      return t.name !== found_tag?.name;
    });
    found_video.tags = video_tags;
    video_repo.save(found_video);
  }
  console.log("finished untagging videos");
  res.status(201).send(found_tag);
  return found_tag;
};

export default UntagVideos;
