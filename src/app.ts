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

dotenv.config();

export let pg_connected = false;

createConnection({
  type: "postgres",
  host: "localhost",
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

export const app = express();
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

const port = process.env.PORT || 3000;

app.get("*", (req: Request, res: Response) => {
  res.json({ message: "page not found" });
});

app.listen(port, () => {
  console.log("listening on: http://localhost:" + port + "/");
});
