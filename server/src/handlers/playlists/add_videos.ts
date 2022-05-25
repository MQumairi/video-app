import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Playlist } from "../../models/playlist";
import { VideoMeta } from "../../models/video_meta";

const add_playlist_video = async (req: Request, res: Response): Promise<Playlist | undefined> => {
  const id = +req.params.id;
  const playlist_repo = getRepository(Playlist);
  const video_repo = getRepository(VideoMeta);
  let found_playlist = await playlist_repo.findOne({ relations: ["videos"], where: { id: id } });
  if (!found_playlist) {
    res.status(404).send("Playlist not found");
    return undefined;
  }
  const videos_to_add: VideoMeta[] = req.body.videos ?? [];
  for (let received_video of videos_to_add) {
    const found_in_playlist = found_playlist.videos.find((vid) => vid.path == received_video.path);
    if (!found_in_playlist) {
      let added_video = await video_repo.findOne({ where: { name: received_video.name } });
      found_playlist.videos.push(added_video ?? (await video_repo.save(new VideoMeta(received_video.path))));
    }
  }
  await playlist_repo.save(found_playlist);
  res.status(201).send(found_playlist);
  return found_playlist;
};

const AddVideo = async (req: Request, res: Response): Promise<Playlist | undefined> => {
  try {
    return add_playlist_video(req, res);
  } catch (error) {
    console.log("Error:", error);
  }
};

export default AddVideo;
