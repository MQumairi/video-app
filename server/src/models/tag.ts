import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm";
import { VideoMeta } from "./video_meta";

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  name: string;

  @ManyToMany((type) => VideoMeta)
  @JoinTable()
  videos: VideoMeta[];
}
