import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, Index, OneToMany } from "typeorm";
import { VideoMeta } from "./video_meta";

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column("text")
  name: string;

  @Index()
  @Column("bool", { default: false })
  is_playlist: boolean;

  @Index()
  @Column("bool", { default: false })
  is_character: boolean;

  @ManyToMany((type) => VideoMeta, (video) => video.tags, { cascade: true })
  @JoinTable()
  videos: VideoMeta[];

  @ManyToMany((type) => Tag)
  @JoinTable()
  child_tags: Tag[];
}
