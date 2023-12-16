import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { PersistentQuery } from "../../models/persistent_query";
import { Playlist } from "../../models/playlist";
import { PlaylistFactory } from "../../lib/videos_lib/playlists/playlist_factory";

const Edit = async (req: Request, res: Response): Promise<Playlist | undefined> => {
  console.log("eneted playlist edit");
  const playlist_repo = getRepository(Playlist);
  const id = +req.params.id;
  const found_playlist = await playlist_repo.findOne(id, { relations: ["included_tags", "persistent_query_to_playlists"] });
  if (found_playlist === undefined) {
    res.status(404).json({ message: "playlist not found, of id: " + id });
    return undefined;
  }
  const submitted_playlist: Playlist = req.body.playlist;
  // Set the playlist name
  found_playlist.name = submitted_playlist.name;
  // Set the playlist queries
  const queries: PersistentQuery[] = req.body.queries;
  const edited_playlist = await PlaylistFactory.set_queries(found_playlist, queries);
  // save
  const saved_playlist = await playlist_repo.save(edited_playlist);
  res.status(200).json({ name: saved_playlist.name });
  return saved_playlist;
};

export default Edit;
