import { getRepository } from "typeorm";
import { Playlist } from "../../../models/playlist";
import { PersistentQueryToPlaylist } from "../../../models/persistent_query_to_playlist";
import { PersistentQuery } from "../../../models/persistent_query";
import { PlaylistCleaner } from "./playlist_cleaner";

export class PlaylistFactory {
  static find_or_create = async (submitted_playlist: Playlist): Promise<Playlist> => {
    const playlist_repo = getRepository(Playlist);
    const found_playlist = await playlist_repo.findOne({ where: { name: submitted_playlist.name } });
    if (found_playlist) return found_playlist;
    const playlist = new Playlist();
    playlist.name = submitted_playlist.name;
    playlist.included_tags = submitted_playlist.included_tags;
    await playlist_repo.save(playlist);
    return playlist;
  };

  static set_queries = async (playlist: Playlist, queries: PersistentQuery[]): Promise<Playlist> => {
    await PlaylistCleaner.reset_playlist(playlist);
    const pq2ps: PersistentQueryToPlaylist[] = [];
    for (let i = 0; i < queries.length; i++) {
      const query = queries[i];
      if (query.id === -1) {
        continue;
      }
      const pq2p = await this.create_pqtp(playlist, query, i + 1);
      pq2ps.push(pq2p);
    }
    playlist.persistent_query_to_playlists = pq2ps;
    return playlist;
  };

  private static async create_pqtp(playlist: Playlist, query: PersistentQuery, order: number): Promise<PersistentQueryToPlaylist> {
    const found_pq2p = await getRepository(PersistentQueryToPlaylist).findOne({
      where: { playlist: { id: playlist.id }, persistent_query: { id: query.id }, order: order },
    });
    if (found_pq2p) {
      return found_pq2p;
    }
    const pq2p = new PersistentQueryToPlaylist();
    pq2p.playlist_2 = playlist;
    pq2p.persistent_query = query;
    pq2p.order = order;
    const created_pq2p = await getRepository(PersistentQueryToPlaylist).save(pq2p);
    return pq2p;
  }
}
