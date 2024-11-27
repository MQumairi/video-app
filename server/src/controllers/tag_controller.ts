import { Router, Request, Response } from "express";
import AddChildTags from "../handlers/tags/child_tags_add";
import Create from "../handlers/tags/create";
import Delete from "../handlers/tags/delete";
import Details from "../handlers/tags/details";
import Edit from "../handlers/tags/edit";
import List from "../handlers/tags/list";
import RemoveChildTags from "../handlers/tags/child_tags_remove";
import UntagVideos from "../handlers/tags/videos_untag";
import Shuffle from "../handlers/tags/shuffle";
import TagVideos from "../handlers/tags/videos_tag";
import GenerateVideoThumbnails from "../handlers/tags/generate_video_thumbnails";
import Playlists from "../handlers/tags/only_playlists";
import Characters from "../handlers/tags/only_characters";
import Studios from "../handlers/tags/only_studios";
import Uncategorized from "../handlers/tags/only_uncategorized";
import RandomImages from "../handlers/tags/random_images";
import TagSingleVideo from "../handlers/tags/single_video_tag";
import RandomImageSingle from "../handlers/tags/random_image_single";
import DynamicPlaylistVideo from "../handlers/tags/dynamic_playlist_video";
import DynamicPlaylists from "../handlers/tags/only_dynamic_playlist";
import Series from "../handlers/tags/only_series";
import DefaultExcluded from "../handlers/tags/only_default_excluded";

const tag_controller = Router();

tag_controller.get("/playlists", async (req: Request, res: Response) => {
  await Playlists(req, res);
});

tag_controller.get("/dynamic-playlists", async (req: Request, res: Response) => {
  await DynamicPlaylists(req, res);
});

tag_controller.get("/series", async (req: Request, res: Response) => {
  await Series(req, res);
});

tag_controller.get("/characters", async (req: Request, res: Response) => {
  await Characters(req, res);
});

tag_controller.get("/studios", async (req: Request, res: Response) => {
  await Studios(req, res);
});

tag_controller.get("/uncategorized", async (req: Request, res: Response) => {
  await Uncategorized(req, res);
});

tag_controller.get("/excluded", async (req: Request, res: Response) => {
  await DefaultExcluded(req, res);
});

tag_controller.get("/", async (req: Request, res: Response) => {
  await List(req, res);
});

tag_controller.get("/dynamic-playlist/:id/order/:order", async (req: Request, res: Response) => {
  await DynamicPlaylistVideo(req, res);
});

tag_controller.get("/:id/shuffle", async (req: Request, res: Response) => {
  await Shuffle(req, res);
});

tag_controller.get("/:id/images", async (req: Request, res: Response) => {
  await RandomImages(req, res);
});

tag_controller.get("/:id/image-slide", async (req: Request, res: Response) => {
  await RandomImageSingle(req, res);
});

tag_controller.get("/:id", async (req: Request, res: Response) => {
  await Details(req, res);
});

tag_controller.post("/", async (req: Request, res: Response) => {
  await Create(req, res);
});

tag_controller.put("/tag-videos", async (req: Request, res: Response) => {
  await TagVideos(req, res);
});

tag_controller.put("/tag-single-video", async (req: Request, res: Response) => {
  await TagSingleVideo(req, res);
});

tag_controller.put("/untag-videos", async (req: Request, res: Response) => {
  await UntagVideos(req, res);
});

tag_controller.put("/generate-video-thumbnails", async (req: Request, res: Response) => {
  console.log("entered generate thumbs for tag");
  await GenerateVideoThumbnails(req, res);
});

tag_controller.put("/:id/children/add", async (req: Request, res: Response) => {
  await AddChildTags(req, res);
});

tag_controller.put("/:id/children/remove", async (req: Request, res: Response) => {
  await RemoveChildTags(req, res);
});

tag_controller.put("/:id", async (req: Request, res: Response) => {
  await Edit(req, res);
});

tag_controller.delete("/:id", async (req: Request, res: Response) => {
  await Delete(req, res);
});

export default tag_controller;
