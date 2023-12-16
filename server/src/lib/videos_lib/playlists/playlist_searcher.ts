import { getRepository } from "typeorm";
import { PersistentQuery } from "../../../models/persistent_query";
import { PersistentQueryToPlaylist } from "../../../models/persistent_query_to_playlist";
import { Playlist } from "../../../models/playlist";

export class PlaylistSearcher {
  static async find_query(playlist: Playlist, order: number): Promise<PersistentQuery | null> {
    const pq2p_arr = await this.find_pq2p(playlist, order);
    const results = pq2p_arr.map((pq2p) => {
      return pq2p.persistent_query;
    });
    if (results.length > 0) return results[0];
    return null;
  }

  static async find_all_queries(playlist: Playlist): Promise<PersistentQuery[]> {
    const queries: PersistentQuery[] = [];
    for (let pq2p of playlist.persistent_query_to_playlists) {
      const fetched_pq2p = await getRepository(PersistentQueryToPlaylist).findOne(pq2p.id, { relations: ["persistent_query"] });
      if (fetched_pq2p) {
        queries.push(fetched_pq2p.persistent_query);
      }
    }
    return queries;
  }

  private static async find_pq2p(playlist: Playlist, order: number): Promise<PersistentQueryToPlaylist[]> {
    const pq2p_repo = getRepository(PersistentQueryToPlaylist);
    return pq2p_repo.find({ where: { playlist_2: { id: playlist.id }, order: order }, order: { order: "ASC" }, relations: ["persistent_query", "playlist_2"] });
  }
}
