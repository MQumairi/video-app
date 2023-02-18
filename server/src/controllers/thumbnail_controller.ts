import { Router, Request, Response } from "express";
import multer from "multer";

const thumbnail_controller = Router();

const storage = multer.diskStorage({
  destination: (req: any, file: any, callBack: any) => {
    callBack(null, "uploads");
  },
  filename: (req: any, file: any, callBack: any) => {
    callBack(null, `${file.originalname}`);
  },
});

let upload = multer({ dest: "thumbnails/" });

thumbnail_controller.post("/upload", upload.single("file"), (req: Request, res: Response) => {
  const video = req.body.video;
  console.log("body is:", req.body);
  res.send(video);
});

export default thumbnail_controller;
