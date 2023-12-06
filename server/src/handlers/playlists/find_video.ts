import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Playlist } from "../../models/playlist";
import { PlaylistVideoSearcher } from "../../lib/videos_lib/playlists/playlist_video_searcher";
import { PlaylistVideoFinderResult } from "../../lib/videos_lib/playlists/models/playist_video_finder_result";

const FindVideo = async (req: Request, res: Response): Promise<PlaylistVideoFinderResult | undefined> => {
  const playlist_repo = getRepository(Playlist);
  const id = +req.params.id;
  const playlist = await playlist_repo.findOne(id, { relations: ["persistent_query_to_playlists", "included_tags"] });
  if (!playlist) {
    res.status(404).json({ message: "playlist not found, of id:" + id });
    return undefined;
  }
  const order = +req.params.order;
  const playlist_video_finder_res = await PlaylistVideoSearcher.find_video_or_next(playlist, order);
  if (!playlist_video_finder_res) {
    res.status(409).send({ message: "no video found for playlist: " + playlist.name + ", order: " + order });
    return undefined;
  }
  res.status(200).json(playlist_video_finder_res);
  return playlist_video_finder_res;
};

export default FindVideo;
