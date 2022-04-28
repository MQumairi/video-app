import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Playlist } from "../../models/playlist";
import { Video } from "../../models/video";

const Delete_Vid = async (req: Request, res: Response) => {
  //Try to create the object
  const playlist_id = +req.params.id;
  try {
    const playlist_repo = getRepository(Playlist);
    const playlist = await playlist_repo.findOne(playlist_id);
    if (playlist == undefined) {
      throw "Playlist is undefined";
    }
    let video_ids = req.body;
    for (const [key, _] of Object.entries(video_ids)) {
      const index_of_video = find_video(playlist.videos, +key);
      playlist.videos.splice(index_of_video, 1);
      playlist_repo.save(playlist);
    }
  } catch (error) {
    //Upon failure, do the following
    res.status(409).send("Failed to create Playlist, error:\n" + error);
  }
  res.redirect(`/playlists/${playlist_id}`);
};

const find_video = (videos: Video[], key: number): number => {
  const video = videos.find((vid) => {
    return vid.id == +key;
  });
  return videos.indexOf(video!);
};

export default Delete_Vid;
