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

dotenv.config();

// createConnection({
//   type: "postgres",
//   host: "localhost",
//   database: process.env.DBNAME,
//   entities: [Video, Tag, Playlist],
//   synchronize: true,
//   logging: false,
// });

export const app = express();
app.use(cors());
app.use(express.json());
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.use("/", videoGUIController);
app.use("/api/videos", videoController);

const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello world" });
});

app.get("*", (req: Request, res: Response) => {
  res.json({ message: "page not found" });
});

app.listen(port, () => {
  console.log("listening on " + port);
});
