import { Router, Request, Response } from "express";
import GUI_Create from "../handlers/playlist_gui/GUI_Create";
import GUI_Details from "../handlers/playlist_gui/GUI_Details";
import GUI_edit from "../handlers/playlist_gui/GUI_Edit";
import GUI_List from "../handlers/playlist_gui/GUI_List";
import GUI_Delete from "../handlers/playlist_gui/GUI_Delete"
import GUI_Playlist_Vid from "../handlers/playlist_gui/GUI_Playlist_Vid";

const playlist_gui_controller = Router();

playlist_gui_controller.get("/", async (req: Request, res: Response) => {
  await GUI_List(req, res);
});

playlist_gui_controller.get("/:id/directory/:dirname/video/:vidname", async (req: Request, res: Response) => {
  await GUI_Playlist_Vid(req, res);
});

playlist_gui_controller.get("/create", async (req: Request, res: Response) => {
  await GUI_Create(req, res);
});

playlist_gui_controller.get("/:id", async (req: Request, res: Response) => {
  await GUI_Details(req, res);
});

playlist_gui_controller.get("/:id/edit", async (req: Request, res: Response) => {
  await GUI_edit(req, res);
});

playlist_gui_controller.get("/:id/delete", async (req: Request, res: Response) => {
  await GUI_Delete(req, res);
});

export default playlist_gui_controller;
