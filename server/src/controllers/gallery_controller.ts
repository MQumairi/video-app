import { Router, Request, Response } from "express";
import multer from "multer";
import UploadForVideo from "../handlers/galleries/upload_for_video";
import CreateGalleryFromVideo from "../handlers/galleries/create_gallery_from_video";
import Delete from "../handlers/galleries/delete";
import Details from "../handlers/galleries/details";
import ImageDelete from "../handlers/galleries/image_delete";
import ImageDetails from "../handlers/galleries/image_details";

multer.diskStorage({
  destination: (req: any, file: any, callBack: any) => {
    callBack(null, "uploads");
  },
  filename: (req: any, file: any, callBack: any) => {
    callBack(null, `${file.originalname}`);
  },
});

const upload = multer({ dest: "images/" });

const gallery_controller = Router();

gallery_controller.post("/from-video", async (req: Request, res: Response) => {
  await CreateGalleryFromVideo(req, res);
});

gallery_controller.post("/upload-for-video", upload.single("file"), async (req: Request, res: Response) => {
  await UploadForVideo(req, res);
});

gallery_controller.get("/:id", async (req: Request, res: Response) => {
  await Details(req, res);
});

gallery_controller.delete("/:id", async (req: Request, res: Response) => {
  await Delete(req, res);
});

gallery_controller.get("/image/:id", async (req: Request, res: Response) => {
  await ImageDetails(req, res);
});

gallery_controller.delete("/image/:id", async (req: Request, res: Response) => {
  await ImageDelete(req, res);
});

export default gallery_controller;
