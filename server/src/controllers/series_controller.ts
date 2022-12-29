import { Router, Request, Response } from "express";
import Create from "../handlers/series/create";
import Delete from "../handlers/series/delete";
import Details from "../handlers/series/details";
import Edit from "../handlers/series/edit";
import List from "../handlers/series/list";
import AddVideo from "../handlers/series/videos_add";
import RemoveVideo from "../handlers/series/videos_remove";

const series_controller = Router();

series_controller.get("/", async (req: Request, res: Response) => {
  await List(req, res);
});

series_controller.post("/", async (req: Request, res: Response) => {
  await Create(req, res);
});

series_controller.get("/:id", async (req: Request, res: Response) => {
  await Details(req, res);
});

series_controller.delete("/:id", async (req: Request, res: Response) => {
  await Delete(req, res);
});

series_controller.put("/:id/video/add", async (req: Request, res: Response) => {
  await AddVideo(req, res);
});

series_controller.put("/:id/video/remove", async (req: Request, res: Response) => {
  await RemoveVideo(req, res);
});

series_controller.put("/:id", async (req: Request, res: Response) => {
  await Edit(req, res);
});

export default series_controller;