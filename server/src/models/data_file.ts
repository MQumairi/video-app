import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { Directory } from "./directory";

@Entity()
export class DataFile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  name: string;

  @OneToOne((type) => Directory, { eager: true })
  @JoinColumn()
  parent: Directory
}