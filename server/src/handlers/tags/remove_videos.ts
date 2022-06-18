import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Tag } from "../../models/tag";
import { VideoMeta } from "../../models/video_meta";

const RemoveVideo = async (req: Request, res: Response): Promise<Tag | undefined> => {
  const id = +req.params.id;
  const tag_repo = getRepository(Tag);
  let found_tag = await tag_repo.findOne(id);
  if (found_tag === undefined) {
    res.status(404).send("Tag not found");
    return undefined;
  }
  const videos_to_remove: VideoMeta[] = req.body.videos;
  for (let received_video of videos_to_remove) {
    const video_repo = getRepository(VideoMeta);
    let found_video = await video_repo.findOne({ relations: ["tags"], where: { id: received_video.id } });
    if (!found_video) continue;
    let video_tags = found_video.tags;
    video_tags = video_tags.filter(function (t) {
      return t.name !== found_tag?.name;
    });
    found_video.tags = video_tags;
    video_repo.save(found_video);
  }
  res.status(201).send(found_tag);
  return found_tag;
};

export default RemoveVideo;
