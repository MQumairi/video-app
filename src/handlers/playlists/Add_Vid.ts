import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Playlist } from "../../models/playlist";
import { Video } from "../../models/video";
import path from "path";

const Add_Vid = async (req: Request, res: Response): Promise<void> => {
  let origin_url: string = (req.headers.referer ?? "/").split("5000")[1].split("?")[0];
  let playlist_name = req.body.playlist;
  let playlist_repo = getRepository(Playlist);
  let playlist = await playlist_repo.findOne({ where: { name: playlist_name } });
  if (playlist == undefined) {
    res.redirect(origin_url);
    return;
  }
  let videos = playlist.videos;
  for (let vid of videos) {
    if (vid.src == origin_url) {
      res.redirect(origin_url);
      return;
    }
  }
  let video = new Video();
  video.src = origin_url.replace("http//localhost:5000", "");
  video.name = path.basename(origin_url).split("%20").join(" ");
  await getRepository(Video).save(video);
  playlist.videos.push(video);
  await playlist_repo.save(playlist);
  res.redirect(origin_url);
};

export default Add_Vid;
