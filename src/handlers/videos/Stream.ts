import { Request, Response } from "express";
import fs from "fs";
import { DirectoryManager } from "../../models/directory_manager";

const Stream = async (req: Request, res: Response): Promise<boolean | undefined> => {
  //Define consts
  const CHUNK_SIZE = 5 ** 6;

  //Parse request
  const range = req.headers.range;
  if (!range) {
    res.status(404).send("Range not found");
    return;
  }

  //Video path
  let dirname = req.params.dirname;
  let vidname = req.params.vidname;
  const path = DirectoryManager.getDataPath() + "/" + dirname + "/" + vidname;

  //Get file size
  const video_size = fs.statSync(path).size;

  let t = range; //"bytes=0-1";
  let ts = t.split("bytes=")[1].split("-");

  const start = Number(ts[0]);
  const end = Number(ts[1]) > start ? Number(ts[1]) : Math.min(start + CHUNK_SIZE, video_size - 1);
  const responseLength = end - start + 1;

  //Write response headers
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${video_size}`,
    "Accept-Ranges": "bytes",
    "Content-Length": responseLength,
    "Content-Type": "video/mp4",
  };
  res.writeHead(206, headers);

  //Pipe binary
  const video_stream = fs.createReadStream(path, { start, end });
  video_stream.pipe(res);
  return true;
};

export default Stream;
