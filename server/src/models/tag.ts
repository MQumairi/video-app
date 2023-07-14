import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, Index, OneToMany, getRepository, ManyToOne } from "typeorm";
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
  is_series: boolean;

  @Index()
  @Column("bool", { default: false })
  is_studio: boolean;

  @Index()
  @Column("bool", { default: false })
  is_script: boolean;

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

  @ManyToOne(() => FileScript, (script) => script.start_tags, { nullable: true, onDelete: "CASCADE" })
  start_script: FileScript;

  @ManyToOne(() => FileScript, (script) => script.cleanup_tags, { nullable: true, onDelete: "CASCADE" })
  cleanup_script: FileScript;

  @Index()
  @Column("bool", { default: false })
  default_excluded: boolean;

  @Index()
  @Column("bool", { default: false })
  default_hidden: boolean;

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

  static tags_equal(arr_1: Tag[], arr_2: Tag[]): boolean {
    if (!arr_1 || !arr_2) return arr_1 === arr_2;
    if (arr_1.length != arr_2.length) return false;
    const set_2 = new Set(Tag.get_ids(arr_2));
    return Tag.get_ids(arr_1).every((i) => set_2.has(i));
  }

  make_default() {
    this.is_playlist = false;
    this.is_character = false;
    this.is_series = false;
    this.is_studio = false;
    this.is_script = false;
  }

  make_playlist() {
    this.is_playlist = true;
    this.is_character = false;
    this.is_series = false;
    this.is_studio = false;
    this.is_script = false;
  }

  make_character() {
    this.is_playlist = false;
    this.is_character = true;
    this.is_series = false;
    this.is_studio = false;
    this.is_script = false;
  }

  make_series() {
    console.log("making series");
    this.is_playlist = false;
    this.is_character = false;
    this.is_series = true;
    this.is_studio = false;
    this.is_script = false;
  }

  make_studio() {
    this.is_playlist = false;
    this.is_character = false;
    this.is_series = false;
    this.is_studio = true;
    this.is_script = false;
  }

  async make_script(start_script: FileScript | null, cleanup_script: FileScript | null) {
    this.is_playlist = false;
    this.is_character = false;
    this.is_series = false;
    this.is_studio = false;
    this.is_script = true;
    const script_repo = getRepository(FileScript);
    if (start_script) {
      const found_start_script = await script_repo.findOne(start_script.id);
      if (found_start_script) this.start_script = found_start_script;
    }
    if (cleanup_script) {
      const found_cleanup_script = await script_repo.findOne(cleanup_script.id);
      if (found_cleanup_script) this.cleanup_script = found_cleanup_script;
    }
  }
}
