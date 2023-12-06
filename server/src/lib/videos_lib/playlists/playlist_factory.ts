import { getRepository } from "typeorm";
import { Playlist } from "../../../models/playlist";
import { PersistentQueryToPlaylist } from "../../../models/persistent_query_to_playlist";
import { PersistentQuery } from "../../../models/persistent_query";
import { PlaylistCleaner } from "./playlist_cleaner";

export class PlaylistFactory {
  static find_or_create = async (name: string): Promise<Playlist> => {
    const playlist_repo = getRepository(Playlist);
    const found_playlist = await playlist_repo.findOne({ where: { name: name } });
    if (found_playlist) return found_playlist;
    const playlist = new Playlist();
    playlist.name = name;
    await playlist_repo.save(playlist);
    return playlist;
  };

  static set_queries = async (playlist: Playlist, queries: PersistentQuery[]): Promise<Playlist> => {
    await PlaylistCleaner.reset_playlist(playlist);
    for (let i = 0; i < queries.length; i++) {
      const query = queries[i];
      await this.create_pqtp(playlist, query, i + 1);
    }
    return playlist;
  };

  private static async create_pqtp(playlist: Playlist, query: PersistentQuery, order: number): Promise<PersistentQueryToPlaylist> {
    const pq2p = new PersistentQueryToPlaylist();
    pq2p.playlist_2 = playlist;
    pq2p.persistent_query = query;
    pq2p.order = order;
    return await getRepository(PersistentQueryToPlaylist).save(pq2p);
  }
}
