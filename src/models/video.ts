import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm";
import { Tag } from "./tag";
import path, { dirname } from "path";

@Entity()
export class Video {
  constructor(src: string) {
    if (!src) return;
    this.src = src;
    this.dir = path.resolve(src, "..");
    this.name = path.basename(src).split(".")[0];
    console.log("src is ", this.src);
    console.log("dir is", this.dir);
    console.log("name is ", this.name);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  src: string;

  @Column("text")
  dir: string;

  @Column("text")
  name: string;

  @ManyToMany((type) => Tag)
  @JoinTable()
  tags: Tag[];

  static getRootPath(): string {
    return dirname(require.main!.filename) + "/..";
  }

  static getFilePath(file_path: string): string {
    return path.join(Video.getRootPath(), file_path);
  }

  static getDataPath(): string {
    return Video.getFilePath("data");
  }
}
