import { Router, Request, Response } from "express";
import GUI_Edit_Dir from "../handlers/video_gui/GUI_Edit_Dir";
import GUI_List_Dirs from "../handlers/video_gui/GUI_List_Dirs";
import GUI_List_Vids from "../handlers/video_gui/GUI_List_Vids";
import GUI_Vid from "../handlers/video_gui/GUI_Vid";

const videoGUIController = Router();

videoGUIController.get("/", async (req: Request, res: Response) => {
  await GUI_List_Dirs(req, res);
});

videoGUIController.get("/directory/:dirname", async (req: Request, res: Response) => {
  await GUI_List_Vids(req, res);
});

videoGUIController.get("/directory/:dirname/edit", async (req: Request, res: Response) => {
  await GUI_Edit_Dir(req, res);
});

videoGUIController.get("/directory/:dirname/video/:vidname", async (req: Request, res: Response) => {
  await GUI_Vid(req, res);
});

export default videoGUIController;
