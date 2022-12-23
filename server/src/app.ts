import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import "reflect-metadata";
import { createConnection, getRepository } from "typeorm";
import { VideoMeta } from "./models/video_meta";
import { Tag } from "./models/tag";
import video_controller from "./controllers/video_controller";
import directory_controller from "./controllers/directory_controller";
import tag_controller from "./controllers/tag_controller";
import playlist_controller from "./controllers/playlist_controller";
import { Directory } from "./models/directory";
import { Series } from "./models/series";
import series_controller from "./controllers/series_controller";
import { existsSync } from "fs";

dotenv.config();

export let pg_connected = false;

createConnection({
  type: "postgres",
  host: "host.docker.internal",
  username: "user",
  database: process.env.DBNAME,
  entities: [VideoMeta, Tag, Series],
  synchronize: true,
  logging: false,
})
  .then(async () => {
    pg_connected = true;
    const main_dir = new Directory("videos");
    await main_dir.read_contents();
    await main_dir.process_sub_dirs(main_dir.directory_paths);
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
app.use("/api/tags", tag_controller);
app.use("/api/playlists", playlist_controller);
app.use("/api/series", series_controller);

export const not_found_error = { message: "page not found" };
export const data_dir = process.env.DATADIR;
export const test_data_dir = process.env.TESTDATADIR;

app.get("/api/clean-database", async (req: Request, res: Response) => {
  let video_repo = getRepository(VideoMeta);
  let videos = await video_repo.find();
  let result = new Map<string, boolean>();
  for (let v of videos) {
    let path_exists = existsSync(v.path);
    result.set(v.name, path_exists);
    if (!path_exists) {
      await video_repo.remove(v);
    }
  }
  res.status(200).json(Object.fromEntries(result));
});

app.get("*", (req: Request, res: Response) => {
  res.status(404).json(not_found_error);
});

export default app;
