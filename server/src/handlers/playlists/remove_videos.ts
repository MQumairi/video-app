import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Playlist } from "../../models/playlist";
import { VideoMeta } from "../../models/video_meta";

const remove_video = async (req: Request, res: Response): Promise<Playlist | undefined> => {
  const id = +req.params.id;
  const playlist_repo = getRepository(Playlist);
  let found_playlist = await playlist_repo.findOne({ relations: ["videos"], where: { id: id } });
  console.log("found playlist:", found_playlist?.id);
  if (!found_playlist) {
    res.status(404).send("Playlist not found");
    return undefined;
  }
  const videos_to_remove: VideoMeta[] = req.body.videos ?? [];
  const old_size = found_playlist.videos.length;
  for (let received_video of videos_to_remove) {
    const found_in_playlist = found_playlist.videos.find((vid) => vid.name == received_video.name);
    if (found_in_playlist) {
      let index_of_video_to_remove = found_playlist.videos.indexOf(found_in_playlist);
      found_playlist.videos.splice(index_of_video_to_remove, 1);
    }
  }
  const new_size = found_playlist.videos.length;
  console.log("Successfully removed", old_size - new_size, "videos");
  await playlist_repo.save(found_playlist);
  res.status(201).send(found_playlist);
  return found_playlist;
};

const RemoveVideo = async (req: Request, res: Response): Promise<Playlist | undefined> => {
  try {
    return remove_video(req, res);
  } catch (error) {
    console.log("Error:", error);
  }
};

export default RemoveVideo;
