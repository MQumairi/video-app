import { getRepository } from "typeorm";
import { Playlist } from "../../../models/playlist";
import { PersistentQueryToPlaylist } from "../../../models/persistent_query_to_playlist";

export class PlaylistCleaner {
  static async reset_playlist(playlist: Playlist) {
    const pq2p_repo = getRepository(PersistentQueryToPlaylist);
    const pq2p_arr = await pq2p_repo.find({ where: { playlist_2: { id: playlist.id } } });
    await pq2p_repo.remove(pq2p_arr);
  }

  static async clean_query_orders(playlist: Playlist): Promise<number> {
    const pq2p_repo = getRepository(PersistentQueryToPlaylist);
    const pq2p_arr = await pq2p_repo.find({ where: { playlist_2: { id: playlist.id } }, order: { order: "ASC" } });
    let modified_pq2ps = 0;
    for (let i = 0; i < pq2p_arr.length; i++) {
      const pq2p = pq2p_arr[i];
      if (pq2p.order !== i + 1) {
        pq2p.order = i + 1;
        await pq2p_repo.save(pq2p);
        modified_pq2ps += 1;
      }
    }
    return modified_pq2ps;
  }
}
