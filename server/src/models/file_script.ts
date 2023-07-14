import { Entity, PrimaryGeneratedColumn, Column, Index, ManyToMany, JoinTable, getRepository, OneToMany } from "typeorm";
import { VideoMeta } from "./video_meta";
import { ImageMeta } from "./image_meta";
import { basename } from "path";
import { ImageGallery } from "./image_gallery";
import { exec as exec_sync } from "child_process";
import { promisify } from "util";
import { Tag } from "./tag";
const exec = promisify(exec_sync);

@Entity()
export class FileScript {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column("text")
  name: string;

  @Index()
  @Column("text")
  path: string;

  // Script associated with file, executing automatically when file is requested
  @Index()
  @Column("bool", { default: false })
  is_start_script: boolean;

  // Script associated with file, requiring manual execution
  @Index()
  @Column("bool", { default: true })
  is_manual_script: boolean;

  // Script that is not associated with any files
  @Index()
  @Column("bool", { default: false })
  is_global_script: boolean;

  @ManyToMany((type) => VideoMeta, (video) => video.file_scripts, { cascade: true })
  @JoinTable()
  videos: VideoMeta[];

  @ManyToMany((type) => ImageMeta, (image) => image.file_scripts, { cascade: true })
  @JoinTable()
  images: ImageMeta[];

  @ManyToMany((type) => Tag, (tag) => tag.galleries, { onDelete: "CASCADE" })
  tags: Tag[];

  @OneToMany((t) => Tag, (tag) => tag.start_script)
  start_tags: Tag[];

  @OneToMany((t) => Tag, (tag) => tag.start_script)
  cleanup_tags: Tag[];

  static create_from_path(path: string): FileScript {
    const file_script = new FileScript();
    file_script.path = path;
    file_script.name = basename(path);
    file_script.is_manual_script = true;
    file_script.is_start_script = false;
    file_script.is_global_script = false;
    return file_script;
  }

  static async find_or_create(script: FileScript): Promise<FileScript> {
    const file_script_repo = getRepository(FileScript);
    const found_script = await file_script_repo.findOne({ where: { path: script.path } });
    if (found_script) {
      return found_script;
    }
    return await file_script_repo.save(script);
  }

  static make_manual_script(script: FileScript) {
    script.is_manual_script = true;
    script.is_start_script = false;
    script.is_global_script = false;
  }

  static make_start_script(script: FileScript) {
    script.is_start_script = true;
    script.is_manual_script = false;
    script.is_global_script = false;
  }

  static make_global_script(script: FileScript) {
    script.is_global_script = true;
    script.is_start_script = false;
    script.is_manual_script = false;
  }

  static script_exists_in(script: FileScript, script_list: FileScript[]): boolean {
    for (let s of script_list) {
      if (s.id === script.id) return true;
    }
    return false;
  }

  static async associate_script_to_gallery(script: FileScript, gallery: ImageGallery) {
    const gallery_repo = getRepository(ImageGallery);
    const found_gallery = await gallery_repo.findOne(gallery);
    const image_repo = getRepository(ImageMeta);
    if (!found_gallery) return;
    for (let image of found_gallery.images) {
      if (FileScript.script_exists_in(script, image.file_scripts)) continue;
      image.file_scripts.push(script);
      await image_repo.save(image);
    }
  }

  static async associate_script_to_video(script: FileScript, video: VideoMeta) {
    const video_repo = getRepository(VideoMeta);
    const found_video = await video_repo.findOne(video, { relations: ["file_scripts"] });
    if (!found_video) return;
    if (FileScript.script_exists_in(script, found_video.file_scripts)) return;
    found_video.file_scripts.push(script);
    await video_repo.save(found_video);
  }

  static async associate_script_to_tag(script: FileScript, tag: Tag) {
    console.log("associated tag to script...");
    const tag_repo = getRepository(Tag);
    if (!FileScript.script_exists_in(script, tag.file_scripts)) {
      tag.file_scripts.push(script);
      const saved_tag = await tag_repo.save(tag);
      console.log("saved tag with scripts:", saved_tag.file_scripts);
    }

    console.log("associated video to script");
    for (let v of tag.videos) {
      console.log(`associating to video: ${v.id}`);
      await FileScript.associate_script_to_video(script, v);
    }

    console.log("associated gallery to script");
    for (let g of tag.galleries) {
      console.log(`associating to gallery: ${g.id}`);
      await FileScript.associate_script_to_gallery(script, g);
    }
  }

  static async execute_script(script: FileScript, args: string) {
    const pass = process.env.SCRIPT_SECRET;
    try {
      const command = `./${script.path} "${pass}" "${args}"`;
      await exec(command);
      return;
    } catch (err: any) {
      console.log("rescued error:");
      if (err.stdout) {
        console.log("----");
        console.log(err.stdout);
        console.log("----");
      }
    }
  }
}
