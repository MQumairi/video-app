import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, Index, getRepository, ManyToOne, OneToMany, OneToOne, JoinColumn } from "typeorm";
import { ImageMeta } from "./image_meta";
import { VideoMeta } from "./video_meta";
import { Tag } from "./tag";
import Tagger from "../lib/tagger";
import { ScriptState } from "./file_script";

@Entity()
export class ImageGallery {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column("text")
  name: string;

  @OneToMany(() => ImageMeta, (i) => i.gallery, { eager: true })
  images: ImageMeta[];

  @OneToOne(() => ImageMeta, { nullable: true, eager: true, onDelete: "SET NULL" })
  @JoinColumn()
  thumbnail: ImageMeta;

  @ManyToMany((type) => Tag, (tag) => tag.galleries, { onDelete: "CASCADE" })
  tags: Tag[];

  @Column("int", { default: ScriptState.unscripted })
  script_state: ScriptState;

  static create(name: string, images: ImageMeta[]): ImageGallery {
    const gallery = new ImageGallery();
    gallery.name = name;
    gallery.images = images;
    return gallery;
  }

  static async find_or_create(video: VideoMeta): Promise<ImageGallery> {
    const gallery_repo = getRepository(ImageGallery);
    const video_repo = getRepository(VideoMeta);
    const found_gallery = await gallery_repo.findOne({ where: { name: video.name } });
    if (found_gallery) {
      console.log(`found gallery is: ${found_gallery.id}`);
      video.gallery = found_gallery;
      await video_repo.save(video);
      return found_gallery;
    }
    console.log("creating a new gallery");
    const saved_gallery = await gallery_repo.save(ImageGallery.create(video.name, []));
    video.gallery = saved_gallery;
    await ImageGallery.apply_tags(saved_gallery, video.tags);
    await video_repo.save(video);
    return saved_gallery;
  }

  static async delete_gallery(gallery: ImageGallery): Promise<boolean> {
    // Stop if images not loaded into gallery
    if (!gallery.images) {
      console.log(`images are null for gallery ${gallery.id}`);
      return false;
    }
    // Otherwise, iterate over images. For each image, trash
    const paths_delete_failure: string[] = [];
    for (let img of gallery.images) {
      const img_del_res = await ImageMeta.delete_image(img);
      if (!img_del_res) paths_delete_failure.push(img.path);
    }
    // Fail if some images no deleted
    if (paths_delete_failure.length > 0) {
      console.log("failed to delete the following images:", paths_delete_failure);
      return false;
    }
    // Delete Gallery if all images deleted
    const deleted_gallery = await getRepository(ImageGallery).remove(gallery);
    if (!deleted_gallery) {
      console.log(`failed to delete gallery ${gallery.id}`);
      return false;
    }
    console.log(`deleted gallery ${gallery.id}`);
    return true;
  }

  static async move_gallery_files(gallery: ImageGallery, dest_dir: string): Promise<boolean> {
    console.log(`moving files for ${gallery.name} to ${dest_dir}`);
    let succeeded = true;
    for (let img of gallery.images) {
      const move_success = await ImageMeta.move(img, dest_dir);
      succeeded = succeeded && move_success;
    }
    return succeeded;
  }

  static async apply_tags(gallery: ImageGallery, tags: Tag[]) {
    const gallery_repo = getRepository(ImageGallery);
    const found_gallery = await gallery_repo.findOne({ where: { id: gallery.id }, relations: ["tags"] });
    if (!found_gallery) return;
    console.log(`found gallery ${found_gallery.id} with ${found_gallery.tags.length} tags`);
    const new_tags = await Tagger.combine(found_gallery.tags, tags);
    found_gallery.tags = new_tags;
    console.log(`now has ${found_gallery.tags.length} tags`);
    await gallery_repo.save(found_gallery);
  }

  static async remove_tags(gallery: ImageGallery, tags: Tag[]) {
    const gallery_repo = getRepository(ImageGallery);
    const found_gallery = await gallery_repo.findOne({ where: { id: gallery.id }, relations: ["tags"] });
    if (!found_gallery) return;
    console.log(`found gallery ${found_gallery.id} with ${found_gallery.tags.length} tags`);
    const new_tags = Tagger.remove(tags, found_gallery.tags);
    console.log(`new tags now: ${new_tags.length} long`);
    found_gallery.tags = new_tags;
    console.log(`now has ${found_gallery.tags.length} tags`);
    await gallery_repo.save(found_gallery);
  }

  static async set_thumbnail(gallery: ImageGallery, thumbnail: ImageMeta) {
    const gallery_repo = getRepository(ImageGallery);
    gallery.thumbnail = thumbnail;
    await gallery_repo.save(gallery);
  }
}
