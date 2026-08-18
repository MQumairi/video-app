import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { PersistentQuery } from "../../models/persistent_query";
import { Playlist } from "../../models/playlist";
import { PlaylistFactory } from "../../lib/videos_lib/playlists/playlist_factory";
import { PlaylistSearcher } from "../../lib/videos_lib/playlists/playlist_searcher";
import { DUPLICATE_SUFFIX } from "../../lib/duplicate_name";

const Duplicate = async (req: Request, res: Response): Promise<Playlist | undefined> => {
  const id = +req.params.id;
  const playlist_repo = getRepository(Playlist);
  const found_playlist = await playlist_repo
    .createQueryBuilder("playlist")
    .leftJoinAndSelect("playlist.persistent_query_to_playlists", "pqp")
    .leftJoinAndSelect("playlist.included_tags", "tag")
    .where("playlist.id = :id", { id })
    .orderBy("pqp.order", "ASC")
    .getOne();
  if (!found_playlist) {
    res.status(404).json({ message: "playlist not found, of id: " + id });
    return undefined;
  }
  // The duplicate points at the same persistent queries, in the same order.
  const queries: PersistentQuery[] = await PlaylistSearcher.find_all_queries(found_playlist);
  const duplicate = new Playlist();
  duplicate.name = `${found_playlist.name} ${DUPLICATE_SUFFIX}`;
  duplicate.included_tags = found_playlist.included_tags ?? [];
  await playlist_repo.save(duplicate);
  await PlaylistFactory.set_queries(duplicate, queries);
  res.status(201).json({ id: duplicate.id, name: duplicate.name });
  return duplicate;
};

export default Duplicate;
