import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, getRepository } from "typeorm";
import { PersistentQuery } from "./persistent_query";
import { Tag } from "./tag";

@Entity()
export class PersistentQueryToPlaylist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("decimal", { default: 0 })
  order: number;

  @ManyToOne(() => PersistentQuery, (query) => query.persistent_query_to_playlists, { onDelete: "CASCADE" })
  persistent_query: PersistentQuery;

  @ManyToOne(() => Tag, (tag) => tag.persistent_query_to_playlists, { onDelete: "CASCADE" })
  playlist: Tag;

  static async create(playlist: Tag, query: PersistentQuery, order: number): Promise<PersistentQueryToPlaylist> {
    const pq2p = new PersistentQueryToPlaylist();
    pq2p.playlist = playlist;
    pq2p.persistent_query = query;
    pq2p.order = order;
    return await getRepository(PersistentQueryToPlaylist).save(pq2p);
  }

  static async find_or_create(playlist: Tag, query: PersistentQuery, order: number): Promise<PersistentQueryToPlaylist> {
    console.log(`entered find_or_create for playlist=${playlist.id}, query=${query.id}, order=${order}`);
    const found_pq2p = await getRepository(PersistentQueryToPlaylist).findOne({
      where: { playlist: { id: playlist.id }, persistent_query: { id: query.id }, order: order },
    });
    if (found_pq2p) {
      console.log("FOUND found_pq2p:", found_pq2p.id);
      return found_pq2p;
    }
    console.log("failed to find... creating");
    return await PersistentQueryToPlaylist.create(playlist, query, order);
  }

  static async find_by_order(playlist: Tag, order: number): Promise<PersistentQueryToPlaylist[]> {
    const pq2p_repo = getRepository(PersistentQueryToPlaylist);
    return pq2p_repo.find({ where: { playlist: { id: playlist.id }, order: order }, order: { order: "ASC" }, relations: ["persistent_query", "playlist"] });
  }
}
