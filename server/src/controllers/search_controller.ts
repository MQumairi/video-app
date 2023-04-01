import { Router, Request, Response } from "express";
import { GetCachedQuery, SetCachedQuery } from "../handlers/search/cached_search_query";
import RandomSearchVideo from "../handlers/search/random_search_video";
import SearchVideo from "../handlers/search/search_video";
import SearchGallery from "../handlers/search/search_gallery";

const search_controller = Router();

search_controller.get("/", async (req: Request, res: Response) => {
  await SearchVideo(req, res);
});

search_controller.get("/galleries", async (req: Request, res: Response) => {
  await SearchGallery(req, res);
});

search_controller.post("/queries", (req: Request, res: Response) => {
  SetCachedQuery(req, res);
});

search_controller.get("/queries", (req: Request, res: Response) => {
  return GetCachedQuery(req, res);
});

search_controller.get("/shuffle", async (req: Request, res: Response) => {
  await RandomSearchVideo(req, res);
});

export default search_controller;
