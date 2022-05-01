import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm";
import { Video } from "./video";

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  name: string;

  @ManyToMany((type) => Video, { eager: true })
  @JoinTable()
  videos: Video[];
}
