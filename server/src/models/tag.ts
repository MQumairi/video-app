import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, Index, OneToMany, getRepository } from "typeorm";
import { VideoMeta } from "./video_meta";
import { ImageGallery } from "./image_gallery";
import { Directory } from "../lib/directory";
import { FileScript } from "./file_script";

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

  @Index()
  @Column("bool", { default: false })
  is_studio: boolean;

  @ManyToMany((type) => VideoMeta, (video) => video.tags, { cascade: true })
  @JoinTable()
  videos: VideoMeta[];

  @ManyToMany((type) => ImageGallery, (gallery) => gallery.tags, { cascade: true })
  @JoinTable()
  galleries: ImageGallery[];

  @ManyToMany((type) => Tag, { cascade: true })
  @JoinTable()
  child_tags: Tag[];

  @ManyToMany((type) => FileScript, (script) => script.tags, { cascade: true })
  @JoinTable()
  file_scripts: FileScript[];

  @Index()
  @Column("bool", { default: false })
  default_excluded: boolean;

  static create(name: string): Tag {
    const tag = new Tag();
    tag.name = name;
    return tag;
  }

  static async tags_from_path(path: string): Promise<Tag[]> {
    const tags: Tag[] = [];
    if (!(await Directory.is_directory(path))) tags;
    const tag_names = path.split("/");
    const tag_repo = getRepository(Tag);
    for (let name of tag_names) {
      let found_tag = await tag_repo.findOne({ where: { name: name } });
      if (found_tag) {
        tags.push(found_tag);
        continue;
      }
      const new_tag = Tag.create(name);
      const saved_tag = await tag_repo.save(new_tag);
      tags.push(saved_tag);
    }
    return tags;
  }

  static get_ids(tags: Tag[]): number[] {
    return tags.map((t) => {
      return t.id;
    });
  }
}
