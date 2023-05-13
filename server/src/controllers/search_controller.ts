import { Router, Request, Response } from "express";
import RandomSearchVideo from "../handlers/search/random_search_video";
import SearchVideo from "../handlers/search/search_video";
import SearchGallery from "../handlers/search/search_gallery";
import TagResults from "../handlers/search/tag_results";

const search_controller = Router();

search_controller.get("/", async (req: Request, res: Response) => {
  await SearchVideo(req, res);
});

search_controller.get("/galleries", async (req: Request, res: Response) => {
  await SearchGallery(req, res);
});

search_controller.get("/shuffle", async (req: Request, res: Response) => {
  await RandomSearchVideo(req, res);
});

search_controller.put("/tag-resuts", async (req: Request, res: Response) => {
  await TagResults(req, res);
});

export default search_controller;
