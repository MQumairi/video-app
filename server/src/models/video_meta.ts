import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm";
import path from "path";
import { Tag } from "./tag";

@Entity()
export class VideoMeta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  name: string;

  @Column("text")
  path: string;

  @Column("text")
  parent_path: string;

  @ManyToMany((type) => Tag, (tag) => tag.videos)
  tags: Tag[];

  constructor(path_: any) {
    if (!path_) {
      return;
    }
    this.name = path.basename(path_);
    this.path = path.join(path_);
    this.parent_path = path.dirname(path_);
  }
}
