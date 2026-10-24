import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, Index, OneToMany, getRepository, ManyToOne } from "typeorm";
import { VideoMeta } from "./video_meta";
import { ImageGallery } from "./image_gallery";
import { Directory } from "../lib/directory";
import { FileScript } from "./file_script";
import { PersistentQuery } from "./persistent_query";
import { PersistentQueryToPlaylist } from "./persistent_query_to_playlist";

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
  is_dynamic_playlist: boolean;

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

  @ManyToMany((type) => Tag, { cascade: true })
  @JoinTable()
  playlist_included_tags: Tag[];

  @ManyToMany((type) => FileScript, (script) => script.tags, { cascade: true })
  @JoinTable()
  file_scripts: FileScript[];

  @ManyToOne(() => FileScript, (script) => script.activatable_tags, { nullable: true, onDelete: "CASCADE" })
  activation_script: FileScript;

  @ManyToOne(() => FileScript, (script) => script.deactivatable_tags, { nullable: true, onDelete: "CASCADE" })
  deactivation_script: FileScript;

  @Index()
  @Column("bool", { default: false })
  default_excluded: boolean;

  @Index()
  @Column("bool", { default: false })
  default_hidden: boolean;

  @ManyToMany((type) => PersistentQuery, (query) => query.included_tags, { cascade: true })
  @JoinTable()
  persistent_queries: PersistentQuery[];

  @ManyToMany((type) => PersistentQuery, (query) => query.excluded_tags, { cascade: true })
  @JoinTable()
  excluded_persistent_queries: PersistentQuery[];

  @ManyToMany((type) => PersistentQuery, (query) => query.studios, { cascade: true })
  @JoinTable()
  studio_persistent_queries: PersistentQuery[];

  @ManyToMany((type) => PersistentQuery, (query) => query.fairness_tags, { cascade: true })
  @JoinTable()
  fairness_persistent_queries: PersistentQuery[];

  @OneToMany(() => PersistentQueryToPlaylist, (pqp) => pqp.playlist)
  persistent_query_to_playlists: PersistentQueryToPlaylist[];

  static create(name: string): Tag {
    const tag = new Tag();
    tag.name = name;
    return tag;
  }

  static async tags_from_path(path: string): Promise<Tag[]> {
    const tags: Tag[] = [];
    if (!(await Directory.is_directory(path))) tags;
    const tag_names = path.split("/");
    for (let name of tag_names) tags.push(await Tag.find_or_create(name));
    return tags;
  }

  // Case-insensitive lookup. If tags differing only by casing already exist, the oldest wins.
  static async find_by_name(name: string, relations: string[] = []): Promise<Tag | undefined> {
    const tag_repo = getRepository(Tag);
    const found_tag = await tag_repo
      .createQueryBuilder("tag")
      .where("LOWER(tag.name) = LOWER(:name)", { name })
      .orderBy("tag.id", "ASC")
      .getOne();
    if (!found_tag || relations.length === 0) return found_tag;
    return tag_repo.findOne(found_tag.id, { relations });
  }

  static async find_or_create(name: string): Promise<Tag> {
    const found_tag = await Tag.find_by_name(name);
    if (found_tag) return found_tag;
    console.log(`a tag named ${name} doesn't exist. Creating.`);
    return getRepository(Tag).save(Tag.create(name));
  }

  static get_ids(tags: Tag[]): number[] {
    return tags.map((t) => {
      return t.id;
    });
  }

  static get_names(tags: Tag[]): string[] {
    return tags.map((t) => {
      return t.name;
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
    this.is_dynamic_playlist = false;
    this.is_character = false;
    this.is_series = false;
    this.is_studio = false;
    this.is_script = false;
  }

  make_playlist() {
    this.is_playlist = true;
    this.is_dynamic_playlist = false;
    this.is_character = false;
    this.is_series = false;
    this.is_studio = false;
    this.is_script = false;
  }

  async make_dynamic_playlist(queries: PersistentQuery[]) {
    this.is_playlist = false;
    this.is_dynamic_playlist = true;
    this.is_character = false;
    this.is_series = false;
    this.is_studio = false;
    this.is_script = false;
    await PersistentQueryToPlaylist.wipe_playlist(this);
    console.log("looping through submitted queries..");
    for (let i = 0; i < queries.length; i++) {
      const query = queries[i];
      if (query.id === -1) {
        console.log("this one is an empty query:", query);
        continue;
      }
      await PersistentQueryToPlaylist.find_or_create(this, query, i + 1);
    }
  }

  make_character() {
    this.is_playlist = false;
    this.is_dynamic_playlist = false;
    this.is_character = true;
    this.is_series = false;
    this.is_studio = false;
    this.is_script = false;
  }

  make_series() {
    this.is_playlist = false;
    this.is_dynamic_playlist = false;
    this.is_character = false;
    this.is_series = true;
    this.is_studio = false;
    this.is_script = false;
  }

  make_studio() {
    this.is_playlist = false;
    this.is_dynamic_playlist = false;
    this.is_character = false;
    this.is_series = false;
    this.is_studio = true;
    this.is_script = false;
  }

  async make_script(activation_script: FileScript | null, deactivation_script: FileScript | null) {
    this.is_playlist = false;
    this.is_dynamic_playlist = false;
    this.is_character = false;
    this.is_series = false;
    this.is_studio = false;
    this.is_script = true;
    const script_repo = getRepository(FileScript);
    if (activation_script) {
      const found_start_script = await script_repo.findOne(activation_script.id);
      if (found_start_script) this.activation_script = found_start_script;
    }
    if (deactivation_script) {
      const found_cleanup_script = await script_repo.findOne(deactivation_script.id);
      if (found_cleanup_script) this.deactivation_script = found_cleanup_script;
    }
  }

  static async create_dynamic_playlist(playlist: Tag, queries: PersistentQuery[]): Promise<Tag> {
    if (!playlist.is_dynamic_playlist) return playlist;
    for (let i = 0; i < queries.length; i++) {
      const query = queries[i];
      await PersistentQueryToPlaylist.create(playlist, query, i + 1);
    }
    return playlist;
  }

  static async get_dynamic_playlist_queries(playlist: Tag): Promise<PersistentQuery[]> {
    if (!playlist.is_dynamic_playlist) return [];
    const queries: PersistentQuery[] = [];
    for (let pq2p of playlist.persistent_query_to_playlists) {
      const fetched_pq2p = await getRepository(PersistentQueryToPlaylist).findOne(pq2p.id, { relations: ["persistent_query"] });
      if (fetched_pq2p) {
        queries.push(fetched_pq2p.persistent_query);
      }
    }
    return queries;
  }

  static async update_dynamic_playlist_query_orders(playlist: Tag) {
    if (!playlist.is_dynamic_playlist) return [];
    const pq2p_repo = getRepository(PersistentQueryToPlaylist);
    const pq2p_arr = await pq2p_repo.find({ where: { playlist: { id: playlist.id } }, order: { order: "ASC" } });
    for (let i = 0; i < pq2p_arr.length; i++) {
      const pq2p = pq2p_arr[i];
      if (pq2p.order !== i + 1) {
        pq2p.order = i + 1;
        await pq2p_repo.save(pq2p);
      }
    }
  }
}
