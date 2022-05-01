import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import "reflect-metadata";
import { createConnection } from "typeorm";
import { Video } from "./models/video";
import { Tag } from "./models/tag";
import { Playlist } from "./models/playlist";
import videoController from "./controllers/video_controller";
import videoGUIController from "./controllers/video_gui_controller";
import playlist_controller from "./controllers/playlist_controller";
import playlist_gui_controller from "./controllers/playlist_gui_controller";
import directory_controller from "./controllers/directory_controller";

dotenv.config();

export let pg_connected = false;

createConnection({
  type: "postgres",
  host: "host.docker.internal",
  username: "user",
  database: process.env.DBNAME,
  entities: [Video, Tag, Playlist],
  synchronize: true,
  logging: false,
})
  .then(() => {
    pg_connected = true;
  })
  .catch(() => {
    console.log("Failed to connect to postgres.");
  });

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.use("/", videoGUIController);
app.use("/playlists", playlist_gui_controller);
app.use("/api/videos", videoController);
app.use("/api/playlists", playlist_controller);
app.use("/api/directories", directory_controller);

app.get("*", (req: Request, res: Response) => {
  res.status(404).json({ message: "page not found" });
});

export default app;
