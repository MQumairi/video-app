import { Router, Request, Response } from "express";
import Stream from "../handlers/videos/stream";
import Metadata from "../handlers/videos/metadata";

const video_controller = Router();

video_controller.get("/:filepath/metadata", async (req: Request, res: Response) => {
  await Metadata(req, res);
});

video_controller.get("/:filepath", async (req: Request, res: Response) => {
  await Stream(req, res);
});

export default video_controller;
