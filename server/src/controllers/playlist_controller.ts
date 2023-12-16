import { Router, Request, Response } from "express";
import List from "../handlers/playlists/list";
import Create from "../handlers/playlists/create";
import Edit from "../handlers/playlists/edit";
import Details from "../handlers/playlists/details";
import FindVideo from "../handlers/playlists/find_video";
import Delete from "../handlers/playlists/delete";

const playlist_controller = Router();

playlist_controller.get("/", async (req: Request, res: Response) => {
  await List(req, res);
});

playlist_controller.post("/", async (req: Request, res: Response) => {
  await Create(req, res);
});

playlist_controller.put("/:id", async (req: Request, res: Response) => {
  await Edit(req, res);
});

playlist_controller.get("/:id/video/:order", async (req: Request, res: Response) => {
  await FindVideo(req, res);
});

playlist_controller.get("/:id", async (req: Request, res: Response) => {
  await Details(req, res);
});

playlist_controller.delete("/:id", async (req: Request, res: Response) => {
  await Delete(req, res);
});

export default playlist_controller;
