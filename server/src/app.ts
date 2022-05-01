import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import "reflect-metadata";
import { createConnection } from "typeorm";
import { Video } from "./models/video";
import { Tag } from "./models/tag";
import video_controller from "./controllers/video_controller";
import directory_controller from "./controllers/directory_controller";
import tag_controller from "./controllers/tag_controller";

dotenv.config();

export let pg_connected = false;

createConnection({
  type: "postgres",
  host: "host.docker.internal",
  username: "user",
  database: process.env.DBNAME,
  entities: [Video, Tag],
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
app.use(express.urlencoded({ extended: true }));
app.use("/api/videos", video_controller);
app.use("/api/directories", directory_controller);
app.use("/api/tags", tag_controller);

export const not_found_error = { message: "page not found" };

app.get("*", (req: Request, res: Response) => {
  res.status(404).json(not_found_error);
});

export default app;
