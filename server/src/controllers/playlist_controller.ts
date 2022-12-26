import { Router, Request, Response } from "express";
import AddVideo from "../handlers/playlists/videos_add";
import Create from "../handlers/playlists/create";
import Delete from "../handlers/playlists/delete";
import Details from "../handlers/playlists/details";
import Edit from "../handlers/playlists/edit";
import List from "../handlers/playlists/list";
import RemoveVideo from "../handlers/playlists/videos_remove";
import Shuffle from "../handlers/playlists/shuffle";

const playlist_controller = Router();

playlist_controller.get("/", async (req: Request, res: Response) => {
  await List(req, res);
});

playlist_controller.post("/", async (req: Request, res: Response) => {
  await Create(req, res);
});

playlist_controller.get("/:id/shuffle", async (req: Request, res: Response) => {
  await Shuffle(req, res);
});

playlist_controller.get("/:id", async (req: Request, res: Response) => {
  await Details(req, res);
});

playlist_controller.delete("/:id", async (req: Request, res: Response) => {
  await Delete(req, res);
});

playlist_controller.put("/:id/video/add", async (req: Request, res: Response) => {
  await AddVideo(req, res);
});

playlist_controller.put("/:id/video/remove", async (req: Request, res: Response) => {
  await RemoveVideo(req, res);
});

playlist_controller.put("/:id", async (req: Request, res: Response) => {
  await Edit(req, res);
});

export default playlist_controller;
