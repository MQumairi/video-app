import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import "reflect-metadata";
import { createConnection } from "typeorm";
import { VideoMeta } from "./models/video_meta";
import { Tag } from "./models/tag";
import video_controller from "./controllers/video_controller";
import directory_controller from "./controllers/directory_controller";
import tag_controller from "./controllers/tag_controller";
import playlist_controller from "./controllers/playlist_controller";
import { Series } from "./models/series";
import series_controller from "./controllers/series_controller";
import search_controller from "./controllers/search_controller";
import cleanup_controller from "./controllers/cleanup_controller";
import { VideoScript } from "./models/video_script";
import scripts_controller from "./controllers/scripts_controller";
import thumbnail_controller from "./controllers/thumbnail_controller";

dotenv.config();

export let pg_connected = false;

createConnection({
  type: "postgres",
  host: "host.docker.internal",
  username: "user",
  database: process.env.DBNAME,
  entities: [VideoMeta, Tag, Series, VideoScript],
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
app.use("/api/videos", video_controller);
app.use("/api/directories", directory_controller);
app.use("/api/search", search_controller);
app.use("/api/tags", tag_controller);
app.use("/api/playlists", playlist_controller);
app.use("/api/series", series_controller);
app.use("/api/scripts", scripts_controller);
app.use("/api/cleanup", cleanup_controller);
app.use("/api/thumbnails", thumbnail_controller);

export const not_found_error = { message: "page not found" };
export const data_dir = process.env.DATADIR;
export const test_data_dir = process.env.TESTDATADIR;

app.get("*", (req: Request, res: Response) => {
  console.log("page not found");
  res.status(404).json(not_found_error);
});

export default app;
