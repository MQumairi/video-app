import { Router, Request, Response } from "express";
import List from "../handlers/file_scripts/list";
import Details from "../handlers/file_scripts/details";
import AssociateTag from "../handlers/file_scripts/associate_tag";
import AssociateVideo from "../handlers/file_scripts/associate_video";
import AssociateGallery from "../handlers/file_scripts/associate_gallery";
import ExecuteAllManual from "../handlers/file_scripts/execute_all_manual";
import ExecuteManualVideo from "../handlers/file_scripts/execute_manual_video";
import ExecuteGlobal from "../handlers/file_scripts/execute_global";
import Edit from "../handlers/file_scripts/edit";
import RemoveVideo from "../handlers/file_scripts/remove_video";
import ExecuteManualGallery from "../handlers/file_scripts/execute_manual_gallery";
import ScriptVideos from "../handlers/file_scripts/script_videos";
import MediaCount from "../handlers/file_scripts/media_count";

const file_script_controller = Router();

file_script_controller.get("/", async (req: Request, res: Response) => {
  await List(req, res);
});

file_script_controller.get("/:id", async (req: Request, res: Response) => {
  await Details(req, res);
});

file_script_controller.get("/:id/videos", async (req: Request, res: Response) => {
  await ScriptVideos(req, res);
});

file_script_controller.get("/:id/media-count", async (req: Request, res: Response) => {
  await MediaCount(req, res);
});

file_script_controller.put("/:id/associate-with-all-tagged-media", async (req: Request, res: Response) => {
  await AssociateTag(req, res);
});

file_script_controller.put("/:id/associate-with-video", async (req: Request, res: Response) => {
  await AssociateVideo(req, res);
});

file_script_controller.put("/:id/associate-with-gallery", async (req: Request, res: Response) => {
  await AssociateGallery(req, res);
});

file_script_controller.put("/:id/execute-manual-script-on-all-media", async (req: Request, res: Response) => {
  await ExecuteAllManual(req, res);
});

file_script_controller.put("/:id/execute-global-script", async (req: Request, res: Response) => {
  await ExecuteGlobal(req, res);
});

file_script_controller.put("/:id/execute-video-script", async (req: Request, res: Response) => {
  console.log("entered ExecuteManualVideo");
  await ExecuteManualVideo(req, res);
});

file_script_controller.put("/:id/execute-gallery-script", async (req: Request, res: Response) => {
  await ExecuteManualGallery(req, res);
});

file_script_controller.put("/:id/edit", async (req: Request, res: Response) => {
  await Edit(req, res);
});

file_script_controller.put("/:id/remove-video", async (req: Request, res: Response) => {
  await RemoveVideo(req, res);
});

export default file_script_controller;
