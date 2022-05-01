import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import path from "path";

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

  constructor(path_: any) {
    if (!path_) {
      return;
    }
    this.name = path.basename(path_);
    this.path = path.join(path_);
    this.parent_path = path.dirname(path_);
  }
}
