import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Tag } from "../../models/tag";
import { VideoMeta } from "../../models/video_meta";

const AddVideo = async (req: Request, res: Response): Promise<Tag | undefined> => {
  const id = +req.params.id;
  const tag_repo = getRepository(Tag);
  const video_repo = getRepository(VideoMeta);
  let found_tag = await tag_repo.findOne(id);
  if (found_tag === undefined) {
    res.status(404).send("Tag not found");
    return undefined;
  }
  const videos_to_add: VideoMeta[] = req.body.videos;
  for (let received_video of videos_to_add) {
    const found_in_tag = found_tag.videos.find((v) => v.path == received_video.path);
    if (!found_in_tag) {
      let new_video = new VideoMeta(received_video.path);
      video_repo.save(new_video);
      found_tag.videos.push(new_video);
    }
  }
  await tag_repo.save(found_tag);
  res.status(201).send(found_tag);
  return found_tag;
};

export default AddVideo;
