import { Router, Request, Response } from "express";
import List from "../handlers/video_scripts/list";
import Delete from "../handlers/video_scripts/delete";
import Details from "../handlers/video_scripts/details";
import Execute from "../handlers/video_scripts/execute";
import Edit from "../handlers/video_scripts/edit";

const scripts_controller = Router();

scripts_controller.get("/", async (req: Request, res: Response) => {
  await List(req, res);
});

scripts_controller.get("/:id", async (req: Request, res: Response) => {
  await Details(req, res);
});

scripts_controller.put("/:id", async (req: Request, res: Response) => {
  await Edit(req, res);
});

scripts_controller.put("/:id/execute", async (req: Request, res: Response) => {
  await Execute(req, res);
});

scripts_controller.delete("/:id", async (req: Request, res: Response) => {
  await Delete(req, res);
});

export default scripts_controller;
