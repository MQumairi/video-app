import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, Index, getRepository, ManyToOne, OneToMany, OneToOne, JoinColumn } from "typeorm";
import { basename, dirname } from "path";
import { Tag } from "./tag";
import { Series } from "./series";
import { ImageGallery } from "./image_gallery";
import { ImageMeta } from "./image_meta";
import { FileTrasher } from "../lib/file_trasher";
import { FileScript } from "./file_script";
import { VideoFileProber } from "../lib/videos_lib/video_file_probber";
import VideoTagger from "../lib/videos_lib/video_tagger";
import G from "glob";

@Entity()
export class VideoMeta {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column("text")
  name: string;

  @Index()
  @Column("text")
  path: string;

  @Column("text")
  parent_path: string;

  @Column("int", { default: 0 })
  rating: number;

  @ManyToMany((type) => Tag, (tag) => tag.videos, { onDelete: "CASCADE" })
  tags: Tag[];

  @ManyToOne(() => Series, (series) => series.videos, { nullable: true, onDelete: "CASCADE" })
  series: Series;

  @Column("int", { default: 1 })
  series_order: number;

  @ManyToMany((type) => FileScript, (script) => script.videos, { onDelete: "CASCADE" })
  file_scripts: FileScript[];

  @OneToOne(() => ImageMeta, { nullable: true, eager: true, onDelete: "SET NULL" })
  @JoinColumn()
  thumbnail: ImageMeta;

  @OneToOne(() => ImageGallery, { nullable: true, eager: false, onDelete: "SET NULL" })
  @JoinColumn()
  gallery: ImageGallery;

  @Column("decimal", { nullable: true })
  duration_sec: number;

  @Column("decimal", { nullable: true })
  width: number;

  @Column("decimal", { nullable: true })
  height: number;

  @Column("timestamptz", { nullable: true })
  created_at: Date;

  @Column("int", { default: 0 })
  views: number;

  static create_from_path(path: string): VideoMeta {
    const video_meta = new VideoMeta();
    video_meta.path = path;
    video_meta.name = basename(path);
    video_meta.parent_path = dirname(path);
    return video_meta;
  }

  static async save_new_video(path: string): Promise<VideoMeta> {
    const video_meta = VideoMeta.create_from_path(path);
    const prober = new VideoFileProber(path);
    const resolution = await prober.get_video_resolution();
    if (resolution) {
      video_meta.width = resolution.width;
      video_meta.height = resolution.height;
    }
    video_meta.duration_sec = await prober.get_video_duration();
    video_meta.created_at = prober.get_created_time();
    const video_repo = getRepository(VideoMeta);
    const saved_video = await video_repo.save(video_meta);
    const tags = await Tag.tags_from_path(saved_video.parent_path);
    const video_tagger = new VideoTagger([saved_video], tags);
    await video_tagger.apply_tags_to_videos();
    return saved_video;
  }

  static async delete_video(video: VideoMeta): Promise<Boolean> {
    try {
      // Trash the file
      const trash_res = await FileTrasher.trash(video.path);
      console.log("delete video trash res:", trash_res);
      if (!trash_res) return false;
      // Remove from db
      await getRepository(VideoMeta).remove(video);
      return true;
    } catch (err) {
      console.log("rescued error:", err);
      return false;
    }
  }

  static async thumb_video(video: VideoMeta, thumbnail: ImageMeta, gallery?: ImageGallery) {
    video.thumbnail = thumbnail;
    await getRepository(VideoMeta).save(video);
    if (!gallery) return;
    console.log("setting gallery thumbnail");
    gallery.thumbnail = thumbnail;
    await getRepository(ImageGallery).save(gallery);
  }

  static has_scripts(video: VideoMeta): boolean {
    return video.file_scripts && video.file_scripts.length > 0;
  }
}
