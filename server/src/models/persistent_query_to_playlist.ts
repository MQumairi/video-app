import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
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
}
