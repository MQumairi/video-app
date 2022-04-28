import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Playlist } from "../../models/playlist";
import Shuffler from "../../models/shuffler";

const GUI_Playlist_Vid = async (req: Request, res: Response): Promise<void> => {
  let playlist_id = req.params.id;
  let dirname = req.params.dirname;
  let vidname = req.params.vidname;
  let video_src = "/api/videos/directory/" + dirname + "/video/" + vidname;
  let random_vid_url = "/playlists/" + playlist_id + (await new Shuffler().playlist_shuffle(+playlist_id));
  const playlists = await getRepository(Playlist).find({ order: { name: "ASC" } });
  res.render("playlists/playlist_video", { VID_SRC: video_src, VID_NAME: vidname, PLAYLISTS: playlists, RANDOM_VID: random_vid_url, PLAYLIST_ID: playlist_id });
};

export default GUI_Playlist_Vid;
