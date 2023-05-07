import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, Index, getRepository, ManyToOne } from "typeorm";
import { ImageGallery } from "./image_gallery";
import { FileScript } from "./file_script";
import { VideoMeta } from "./video_meta";
import { ImageFileProbber } from "../lib/images_lib/image_file_probber";
import { FileTrasher } from "../lib/file_trasher";
import { existsSync } from "fs";

@Entity()
export class ImageMeta {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column("text")
  path: string;

  @Column()
  order_number: number;

  @Column({ default: 0 })
  width: number;

  @Column({ default: 0 })
  height: number;

  @Column("decimal", { nullable: true })
  timestamp_secs: number;

  @ManyToOne(() => ImageGallery, (gallery) => gallery.images, { nullable: true, onDelete: "CASCADE" })
  gallery: ImageGallery;

  @ManyToMany((type) => FileScript, (script) => script.images, { onDelete: "CASCADE", eager: true })
  file_scripts: FileScript[];

  static async create(path: string, order_number: number, gallery: ImageGallery): Promise<ImageMeta> {
    const image = new ImageMeta();
    image.path = path;
    image.order_number = order_number;
    image.gallery = gallery;
    const dimensions = await ImageFileProbber.get_image_size(image);
    image.width = dimensions.width;
    image.height = dimensions.height;
    return image;
  }

  static async add_to_gallery(path: string, gallery: ImageGallery): Promise<ImageMeta> {
    const image = await ImageMeta.create(path, gallery.images.length, gallery);
    return await getRepository(ImageMeta).save(image);
  }

  static async add_to_gallery_with_scripts(path: string, gallery: ImageGallery, scripts: FileScript[]): Promise<ImageMeta> {
    const image = await ImageMeta.create(path, gallery.images.length, gallery);
    if (scripts) {
      console.log(`adding ${scripts.length} to image ${image.id}`);
      image.file_scripts = scripts;
    }
    return await getRepository(ImageMeta).save(image);
  }

  static async add_thumbnail_to_gallery(path: string, gallery: ImageGallery): Promise<ImageMeta> {
    const image = await ImageMeta.create(path, gallery.images.length, gallery);
    return await getRepository(ImageMeta).save(image);
  }

  static async add_thumbnail_to_video_gallery(path: string, video: VideoMeta, gallery: ImageGallery, timestamp: number): Promise<ImageMeta> {
    const image = await ImageMeta.create(path, gallery.images.length, gallery);
    image.timestamp_secs = timestamp;
    if (video.file_scripts) image.file_scripts = video.file_scripts;
    return await getRepository(ImageMeta).save(image);
  }

  static async delete_image(image: ImageMeta): Promise<boolean> {
    const delete_successful = await FileTrasher.trash(image.path);
    if (delete_successful) {
      await getRepository(ImageMeta).remove(image);
      return true;
    }
    if (existsSync(image.path)) return false;
    await getRepository(ImageMeta).remove(image);
    return true;
  }
}
