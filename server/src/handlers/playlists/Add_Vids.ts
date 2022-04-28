import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Playlist } from "../../models/playlist";
import { Video } from "../../models/video";

const Add_Vids = async (req: Request, res: Response) => {
  //Try to create the object
  const dir_name = req.params.dirname;
  try {
    let selected_playlist = req.body.playlist;
    delete req.body["playlist"];
    let videos = req.body;
    // Find the Playlist
    const playlist_repo = getRepository(Playlist);
    let playlist = await playlist_repo.findOne({ where: { name: selected_playlist } });
    if (playlist == undefined) {
      throw "Playlist not found";
    }
    // Iterate through videos, for each video, add to the playlist if it's not already in the playlist
    for (const [key, _] of Object.entries(videos)) {
      // Get the video, from DB, else create it
      const vid_source = `/directory/${dir_name}/video/${key}`;
      const video = await get_video(key, vid_source);
      const index_of_video = playlist.videos.indexOf(video);
      if (index_of_video === -1) {
        playlist.videos.push(video);
        playlist_repo.save(playlist);
      }
    }
  } catch (error) {
    //Upon failure, do the following
    res.status(409).send("Failed to create Playlist, error:\n" + error);
  }
  res.redirect(`/directory/${dir_name}/edit`);
};

const get_video = async (vid_name: string, vid_url: string): Promise<Video> => {
  const vid_repo = getRepository(Video);
  const found_video = await vid_repo.findOne({ where: { name: vid_name } });
  if (found_video) {
    return found_video;
  }
  const new_video = new Video();
  new_video.name = vid_name;
  new_video.src = vid_url;
  vid_repo.save(new_video);
  return new_video;
};

export default Add_Vids;
