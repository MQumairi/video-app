import { Request, Response } from "express";

const GUI_Create = async (req: Request, res: Response): Promise<void> => {
  res.render("playlists/playlist_create.ejs");
};

export default GUI_Create;
