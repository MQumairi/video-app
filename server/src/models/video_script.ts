import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, Index, OneToMany } from "typeorm";
import { VideoMeta } from "./video_meta";
import path from "path";

@Entity()
export class VideoScript {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column("text")
  name: string;

  @Column("text")
  path: string;

  @Column("text")
  command: string;

  @ManyToMany((type) => VideoMeta, (video) => video.scripts, { cascade: true })
  @JoinTable()
  videos: VideoMeta[];

  constructor(path_: string, command: string | null = null) {
    if (!path_) {
      return;
    }
    this.name = path.basename(path_);
    this.path = path.join(path_);
    this.command = command ?? "./" + this.path;
  }
}
