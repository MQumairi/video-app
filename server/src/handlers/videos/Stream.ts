import { Request, Response } from "express";
import { Streamer } from "../../lib/streamer";
import { not_found_error } from "../../app";
import { Directory } from "../../lib/directory";

const Stream = async (req: Request, res: Response): Promise<boolean> => {
  try {
    // Determine that request includes a range
    const range = req.headers.range;
    if (!range) {
      res.status(404).send(not_found_error);
      return false;
    }

    //Determine that video path is valid
    const vid_path = req.params.filepath;
    if (!Directory.is_video(vid_path)) {
      res.status(404).send(not_found_error);
      return false;
    }

    // Create Streamer
    const streamer = new Streamer(vid_path, range);

    // Write headers
    res.writeHead(206, streamer.get_header());

    //Pipe binary
    const video_stream = streamer.create_stream();
    video_stream.pipe(res);
    return true;
  } catch (error: any) {
    if (error.code == "ENOENT") {
      res.status(404).json({ message: "file not found." });
    } else {
      console.log("error:", error);
    }
    return false;
  }
};

export default Stream;
