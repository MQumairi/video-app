import { Router, Request, Response } from "express";
import CleanupDatabase from "../handlers/cleanup/cleanup_database";
import CleanupTags from "../handlers/cleanup/cleanup_tags";
import CleanupDuplicateTags from "../handlers/cleanup/cleanup_duplicate_tags";
import CleanupScripts from "../handlers/cleanup/cleanup_scripts";

const cleanup_controller = Router();

// Cleans up database from videos with paths that no longer exist
cleanup_controller.get("/missing-videos", async (req: Request, res: Response) => {
  await CleanupDatabase(req, res);
});

// Iterates over video folder, tagging videos based on their directory structure
cleanup_controller.get("/tag-videos", async (req: Request, res: Response) => {
  await CleanupTags(req, res);
});

// Cleanup from duplicate tags
cleanup_controller.get("/duplicate-tags", async (req: Request, res: Response) => {
  await CleanupDuplicateTags(req, res);
});

// Cleanup scripts
cleanup_controller.get("/scripts", async (req: Request, res: Response) => {
  await CleanupScripts(req, res);
});

export default cleanup_controller;
