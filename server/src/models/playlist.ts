import { Column, Entity, Index, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Tag } from "./tag";
import { PersistentQueryToPlaylist } from "./persistent_query_to_playlist";

@Entity()
export class Playlist {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column("text")
  name: string;

  @ManyToMany(() => Tag, { cascade: true })
  @JoinTable()
  included_tags: Tag[];

  @OneToMany(() => PersistentQueryToPlaylist, (pqp) => pqp.playlist_2)
  persistent_query_to_playlists: PersistentQueryToPlaylist[];
}
