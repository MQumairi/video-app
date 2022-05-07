import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Tag } from "../../models/tag";
import { VideoMeta } from "../../models/video_meta";

const add_tag_video = async (req: Request, res: Response): Promise<Tag | undefined> => {
  const id = +req.params.id;
  const tag_repo = getRepository(Tag);
  const video_repo = getRepository(VideoMeta);
  let found_tag = await tag_repo.findOne({ relations: ["videos"], where: { id: id } });
  if (!found_tag) {
    res.status(404).send("Tag not found");
    return undefined;
  }
  const videos_to_add: VideoMeta[] = req.body.videos ?? [];
  for (let received_video of videos_to_add) {
    const found_in_tag = found_tag.videos.find((vid) => vid.path == received_video.path);
    if (!found_in_tag) {
      let added_video = await video_repo.findOne({ where: { name: received_video.name } });
      found_tag.videos.push(added_video ?? (await video_repo.save(new VideoMeta(received_video.path))));
    }
  }
  await tag_repo.save(found_tag);
  res.status(201).send(found_tag);
  return found_tag;
};

const AddVideo = async (req: Request, res: Response): Promise<Tag | undefined> => {
  try {
    return add_tag_video(req, res);
  } catch (error) {
    console.log("Error:", error);
  }
};

export default AddVideo;
