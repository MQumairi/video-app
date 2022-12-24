import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, Index, getRepository, ManyToOne } from "typeorm";
import path from "path";
import { Tag } from "./tag";
// import { apply_tags_to_videos } from "../handlers/tags/tag_videos";
import { Series } from "./series";

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

  @ManyToOne(() => Series, (series) => series.videos, { nullable: true, onDelete: "CASCADE" })
  series: Series;

  @Column("int", { default: 1 })
  series_order: number;

  constructor(path_: any) {
    if (!path_) {
      return;
    }
    this.name = path.basename(path_);
    this.path = path.join(path_);
    this.parent_path = path.dirname(path_);
  }

  // static async apply_tag(video: VideoMeta, tag: Tag): Promise<void> {
  //   await apply_tags_to_videos([video], [tag]);
  // }
}
