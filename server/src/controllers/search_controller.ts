import { Router, Request, Response } from "express";
import { GetCachedQuery, SetCachedQuery } from "../handlers/search/cached_search_query";
import RandomSearchVideo from "../handlers/search/random_search_video";
import Search from "../handlers/search/search";

const search_controller = Router();

search_controller.get("/", async (req: Request, res: Response) => {
  await Search(req, res);
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
