import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import path from "path";

@Entity()
export class Video {
  constructor(path_: string) {
    if (path_ == "") {
      return;
    }
    this.path == path_;
    this.name = path.basename(path_);
  }
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  name: string;

  @Column("text")
  path: string;
}
