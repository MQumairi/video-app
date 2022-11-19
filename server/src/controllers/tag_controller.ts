import { Router, Request, Response } from "express";
import AddChildTags from "../handlers/tags/add_child_tags";
import AddVideo from "../handlers/tags/add_videos";
import Create from "../handlers/tags/create";
import Delete from "../handlers/tags/delete";
import Details from "../handlers/tags/details";
import Edit from "../handlers/tags/edit";
import List from "../handlers/tags/list";
import RemoveChildTags from "../handlers/tags/remove_child_tags";
import RemoveVideo from "../handlers/tags/remove_videos";
import Shuffle from "../handlers/tags/shuffle";
import TagAll from "../handlers/tags/tag_all";
import TagVideos from "../handlers/tags/tag_videos";

const tag_controller = Router();

tag_controller.get("/", async (req: Request, res: Response) => {
  await List(req, res);
});

tag_controller.post("/", async (req: Request, res: Response) => {
  await Create(req, res);
});

tag_controller.get("/tag-all", async (req: Request, res: Response) => {
  await TagAll(req, res);
});

tag_controller.get("/:id/shuffle", async (req: Request, res: Response) => {
  await Shuffle(req, res);
});

tag_controller.get("/:id", async (req: Request, res: Response) => {
  await Details(req, res);
});

tag_controller.delete("/:id", async (req: Request, res: Response) => {
  await Delete(req, res);
});

tag_controller.put("/tag-videos", async (req: Request, res: Response) => {
  await TagVideos(req, res);
});

tag_controller.put("/:id/video/add", async (req: Request, res: Response) => {
  await AddVideo(req, res);
});

tag_controller.put("/:id/video/remove", async (req: Request, res: Response) => {
  await RemoveVideo(req, res);
});

tag_controller.put("/:id/children/add", async (req: Request, res: Response) => {
  await AddChildTags(req, res);
});

tag_controller.put("/:id/children/remove", async (req: Request, res: Response) => {
  await RemoveChildTags(req, res);
});

tag_controller.put("/:id", async (req: Request, res: Response) => {
  await Edit(req, res);
});

export default tag_controller;
