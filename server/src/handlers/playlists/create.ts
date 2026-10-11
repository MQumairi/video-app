import { Request, Response } from "express";
import { Playlist } from "../../models/playlist";
import { PlaylistFactory } from "../../lib/videos_lib/playlists/playlist_factory";
import { PersistentQuery } from "../../models/persistent_query";

const Create = async (req: Request, res: Response): Promise<Playlist | undefined> => {
  try {
    const submitted_playlist: Playlist = req.body.playlist;
    console.log("submitted playlist:", submitted_playlist);
    const playlist_error = await PersistentQuery.playlist_assignment_error(req.body.queries);
    if (playlist_error) {
      res.status(400).send(playlist_error);
      return undefined;
    }
    const playlist = await PlaylistFactory.find_or_create(submitted_playlist);
    const submitted_queries: PersistentQuery[] = req.body.queries;
    await PlaylistFactory.set_queries(playlist, submitted_queries);
    res.sendStatus(201);
    return playlist;
  } catch (error) {
    console.log(error);
    res.status(409).json(error);
    return undefined;
  }
};

export default Create;
