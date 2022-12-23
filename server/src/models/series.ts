import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { VideoMeta } from "./video_meta";

@Entity()
export class Series {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column("text")
  name: string;

  @OneToMany(() => VideoMeta, (v) => v.series, { eager: true })
  videos: VideoMeta[];
}
