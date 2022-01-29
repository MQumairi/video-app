import { Request, Response } from "express";

const GUI_Vid = async (req: Request, res: Response): Promise<void> => {
  let dirname = req.params.dirname;
  let vidname = req.params.vidname;
  res.render("video.ejs", { DIR_NAME: dirname, VID_NAME: vidname });
};

export default GUI_Vid;
