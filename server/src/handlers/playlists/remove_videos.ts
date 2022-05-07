import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Playlist } from "../../models/playlist";
import { VideoMeta } from "../../models/video_meta";

const RemoveVideo = async (req: Request, res: Response): Promise<Playlist | undefined> => {
  const id = +req.params.id;
  const playlist_repo = getRepository(Playlist);
  let found_playlist = await playlist_repo.findOne(id);
  if (!found_playlist) {
    res.status(404).send("Playlist not found");
    return undefined;
  }
  const videos_to_remove: VideoMeta[] = req.body.videos;
  for (let received_video of videos_to_remove) {
    const found_in_playlist = found_playlist.videos.find((v) => v.path == received_video.path);
    if (found_in_playlist) {
      const index_to_remove = found_playlist.videos.indexOf(found_in_playlist);
      found_playlist.videos.splice(index_to_remove, 1);
    }
  }
  await playlist_repo.save(found_playlist);
  res.status(201).send(found_playlist);
  return found_playlist;
};

export default RemoveVideo;
