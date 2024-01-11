import { Router, Request, Response } from "express";
import CleanupMissingVideos from "../handlers/cleanup/cleanup_missing_videos";
import CleanupNewVideos from "../handlers/cleanup/cleanup_new_videos";
import CleanupDuplicateTags from "../handlers/cleanup/cleanup_duplicate_tags";
import CleanupThumbnails from "../handlers/cleanup/cleanup_thumbnails";
import CleanupVideoFileMeta from "../handlers/cleanup/cleanup_video_file_meta";
import CleanupFileScripts from "../handlers/cleanup/cleanup_file_scripts";
import CleanupGalleries from "../handlers/cleanup/cleanup_galleries";
import CleanupImages from "../handlers/cleanup/cleanup_images";
import CleanupExportedData from "../handlers/cleanup/cleanup_exported_data";

const cleanup_controller = Router();

// Cleans up database from videos with paths that no longer exist
cleanup_controller.get("/missing-videos", async (req: Request, res: Response) => {
  await CleanupMissingVideos(req, res);
});

// Iterates over video folder, tagging videos based on their directory structure
cleanup_controller.get("/new-videos", async (req: Request, res: Response) => {
  await CleanupNewVideos(req, res);
});

// Cleanup from duplicate tags
cleanup_controller.get("/duplicate-tags", async (req: Request, res: Response) => {
  await CleanupDuplicateTags(req, res);
});

// Cleanup file-scripts
cleanup_controller.get("/file-scripts", async (req: Request, res: Response) => {
  await CleanupFileScripts(req, res);
});

// Cleanup Thumbnails
cleanup_controller.get("/thumbnails", async (req: Request, res: Response) => {
  await CleanupThumbnails(req, res);
});

cleanup_controller.get("/video-file-meta", async (req: Request, res: Response) => {
  await CleanupVideoFileMeta(req, res);
});

cleanup_controller.get("/galleries", async (req: Request, res: Response) => {
  console.log("entered cleanup galleries");
  await CleanupGalleries(req, res);
});

cleanup_controller.get("/images", async (req: Request, res: Response) => {
  console.log("entered cleanup galleries");
  await CleanupImages(req, res);
});

cleanup_controller.get("/exports", async (req: Request, res: Response) => {
  console.log("entered cleanup exported");
  await CleanupExportedData(req, res);
});

export default cleanup_controller;
