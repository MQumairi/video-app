import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, getRepository } from "typeorm";
import { PersistentQuery } from "./persistent_query";
import { Tag } from "./tag";

@Entity()
export class PersistentQueryToPlaylist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("decimal", { default: 0 })
  order: number;

  @ManyToOne(() => PersistentQuery, (query) => query.persistent_query_to_playlists)
  persistent_query: PersistentQuery;

  @ManyToOne(() => Tag, (tag) => tag.persistent_query_to_playlists)
  playlist: Tag;

  static async create(playlist: Tag, query: PersistentQuery, order: number): Promise<PersistentQueryToPlaylist> {
    const pq2p = new PersistentQueryToPlaylist();
    pq2p.playlist = playlist;
    pq2p.persistent_query = query;
    pq2p.order = order;
    return await getRepository(PersistentQueryToPlaylist).save(pq2p);
  }
}
