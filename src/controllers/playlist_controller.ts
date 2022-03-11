import { Router, Request, Response } from "express";
import Add_Vid from "../handlers/playlists/Add_Vid";
import Create from "../handlers/playlists/Create";
import Delete_Vid from "../handlers/playlists/Delete_Vid";

const playlist_controller = Router();

playlist_controller.post("/add-video", async (req: Request, res: Response) => {
  await Add_Vid(req, res);
});

playlist_controller.post("/:id/delete-videos", async (req: Request, res: Response) => {
  await Delete_Vid(req, res);
});

playlist_controller.post("/", async (req: Request, res: Response) => {
  await Create(req, res);
});

export default playlist_controller;
