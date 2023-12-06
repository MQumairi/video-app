import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import "reflect-metadata";
import { createConnection } from "typeorm";
import { VideoMeta } from "./models/video_meta";
import { Tag } from "./models/tag";
import { Series } from "./models/series";
import { ImageGallery } from "./models/image_gallery";
import { ImageMeta } from "./models/image_meta";
import { FileScript } from "./models/file_script";
import { Playlist } from "./models/playlist";
import { PersistentQuery } from "./models/persistent_query";
import { PersistentQueryToPlaylist } from "./models/persistent_query_to_playlist";
import video_controller from "./controllers/video_controller";
import directory_controller from "./controllers/directory_controller";
import tag_controller from "./controllers/tag_controller";
import series_controller from "./controllers/series_controller";
import search_controller from "./controllers/search_controller";
import cleanup_controller from "./controllers/cleanup_controller";
import gallery_controller from "./controllers/gallery_controller";
import file_script_controller from "./controllers/file_script_controller";
import persistent_query_controller from "./controllers/persistent_query_controller";

dotenv.config();

export let pg_connected = false;

createConnection({
  type: "postgres",
  host: "host.docker.internal",
  username: "user",
  database: process.env.DBNAME,
  entities: [VideoMeta, Tag, Series, ImageMeta, ImageGallery, FileScript, PersistentQuery, PersistentQueryToPlaylist, Playlist],
  synchronize: true,
  logging: false,
})
  .then(async () => {
    pg_connected = true;
  })
  .catch((error) => {
    console.log(error);
    console.log("Failed to connect to postgres.");
  });

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("images"));
app.use("/api/videos", video_controller);
app.use("/api/directories", directory_controller);
app.use("/api/search", search_controller);
app.use("/api/tags", tag_controller);
app.use("/api/series", series_controller);
app.use("/api/file-scripts", file_script_controller);
app.use("/api/cleanup", cleanup_controller);
app.use("/api/galleries", gallery_controller);
app.use("/api/persistent-queries", persistent_query_controller);

export const not_found_error = { message: "page not found" };
export const data_dir = process.env.DATADIR;
export const test_data_dir = process.env.TESTDATADIR;

app.get("*", (req: Request, res: Response) => {
  console.log("page not found");
  res.status(404).json(not_found_error);
});

export default app;
