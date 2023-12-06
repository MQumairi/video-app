import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { PersistentQuery } from "../../models/persistent_query";
import { Playlist } from "../../models/playlist";
import { PlaylistSearcher } from "../../lib/videos_lib/playlists/playlist_searcher";

const Details = async (req: Request, res: Response): Promise<Playlist | undefined> => {
  const id = +req.params.id;
  const playlist_repo = getRepository(Playlist);
  const playlist = await playlist_repo.findOne(id, { relations: ["persistent_query_to_playlists", "included_tags"] });
  if (!playlist) {
    res.status(404).json({ message: "playlist not found, of id:" + id });
    return undefined;
  }
  const queries: PersistentQuery[] = await PlaylistSearcher.find_all_queries(playlist);
  res.status(200).send({ playlist, queries });
  return playlist;
};

export default Details;
