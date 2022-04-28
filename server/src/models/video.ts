import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm";
import { Tag } from "./tag";
import path, { dirname } from "path";

@Entity()
export class Video {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  name: string;

  @Column("text")
  src: string;

  @ManyToMany((type) => Tag, { eager: true })
  @JoinTable()
  tags: Tag[];
}
