import { Request, Response } from "express";
import { Playlist } from "../../models/playlist";
import { PlaylistFactory } from "../../lib/videos_lib/playlists/playlist_factory";
import { PersistentQuery } from "../../models/persistent_query";

const Create = async (req: Request, res: Response): Promise<Playlist | undefined> => {
  try {
    const playlist = await PlaylistFactory.find_or_create(req.body.name);
    const queries: PersistentQuery[] = req.body.queries;
    await PlaylistFactory.set_queries(playlist, queries);
    res.status(201).send(playlist);
    return playlist;
  } catch (error) {
    res.status(409).json(error);
    return undefined;
  }
};

export default Create;
