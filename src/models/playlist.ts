import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm";
import { Video } from "./video";

@Entity()
export class Playlist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  name: string;

  @ManyToMany((type) => Video, { eager: true })
  @JoinTable()
  videos: Video[];
}
