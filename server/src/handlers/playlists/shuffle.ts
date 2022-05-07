import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Playlist } from "../../models/playlist";
import { VideoMeta } from "../../models/video_meta";
import get_random_int from "../../util/shuffle_method";

const Shuffle = async (req: Request, res: Response): Promise<VideoMeta | undefined> => {
  const id = +req.params.id;
  const playlist_repo = getRepository(Playlist);
  const playlist = await playlist_repo.findOne({ relations: ["videos"], where: { id: id } });
  if (!playlist) {
    res.status(404).send("Playlist not found");
    return undefined;
  }
  const videos = playlist.videos;
  const random_index = get_random_int(videos.length);
  const random_video = videos[random_index];
  res.status(200).send(random_video);
  return random_video;
};

export default Shuffle;
