import { Router, Request, Response } from "express";
import Stream from "../handlers/videos/Stream";

const videoController = Router();

videoController.get("/directory/:dirname/video/:vidname", async (req: Request, res: Response) => {
  await Stream(req, res);
});

export default videoController;
