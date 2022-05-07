import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm";
import { VideoMeta } from "./video_meta";

@Entity()
export class Playlist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  name: string;

  @ManyToMany((type) => VideoMeta, (video) => video.playlists, { cascade: true })
  @JoinTable()
  videos: VideoMeta[];
}
