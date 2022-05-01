import { Router, Request, Response } from "express";
import Stream from "../handlers/videos/stream";

const video_controller = Router();

// video_controller.get("/directory/:dirname/video/:vidname", async (req: Request, res: Response) => {
//   await Stream(req, res);
// });

video_controller.get("/:filepath", async (req: Request, res: Response) => {
  await Stream(req, res);
});

export default video_controller;
