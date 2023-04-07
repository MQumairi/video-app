import { Router, Request, Response } from "express";
import Metadata from "../handlers/videos/metadata";
import Rate from "../handlers/videos/rate";
import Edit from "../handlers/videos/edit";
import Stream from "../handlers/videos/stream";
import ThumbVideo from "../handlers/videos/thumb_video";
import Gallery from "../handlers/videos/gallery";
import Delete from "../handlers/videos/delete";
import Tags from "../handlers/videos/tags";
import Scripts from "../handlers/videos/scripts";
import ProcessVideoMeta from "../handlers/videos/process_video_meta";
import Details from "../handlers/videos/details";

const video_controller = Router();

video_controller.get("/:id/gallery", async (req: Request, res: Response) => {
  await Gallery(req, res);
});

video_controller.get("/:id/tags", async (req: Request, res: Response) => {
  await Tags(req, res);
});

video_controller.get("/:id/scripts", async (req: Request, res: Response) => {
  await Scripts(req, res);
});

video_controller.get("/:filepath/metadata", async (req: Request, res: Response) => {
  await Metadata(req, res);
});

video_controller.get("/stream/:filepath", async (req: Request, res: Response) => {
  await Stream(req, res);
});

video_controller.get("/:id", async (req: Request, res: Response) => {
  await Details(req, res);
});

video_controller.put("/:id/rate", async (req: Request, res: Response) => {
  await Rate(req, res);
});

video_controller.put("/:id/add-thumbnail", async (req: Request, res: Response) => {
  await ThumbVideo(req, res);
});

video_controller.put("/:id", async (req: Request, res: Response) => {
  await Edit(req, res);
});

video_controller.put("/:id/process-meta-data", async (req: Request, res: Response) => {
  await ProcessVideoMeta(req, res);
});

video_controller.delete("/:id", async (req: Request, res: Response) => {
  await Delete(req, res);
});

export default video_controller;
