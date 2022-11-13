import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, Index, getRepository } from "typeorm";
import path from "path";
import { Tag } from "./tag";
import { apply_tags_to_videos } from "../handlers/tags/tag_videos";

@Entity()
export class VideoMeta {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column("text")
  name: string;

  @Index()
  @Column("text")
  path: string;

  @Column("text")
  parent_path: string;

  @Column("int", { default: 0 })
  rating: number;

  @ManyToMany((type) => Tag, (tag) => tag.videos, { onDelete: "CASCADE" })
  tags: Tag[];

  constructor(path_: any) {
    if (!path_) {
      return;
    }
    this.name = path.basename(path_);
    this.path = path.join(path_);
    this.parent_path = path.dirname(path_);
  }

  static async apply_tag(video: VideoMeta, tag: Tag): Promise<void> {
    await apply_tags_to_videos([video], [tag]);
  }
}
