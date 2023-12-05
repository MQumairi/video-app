import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Tag } from "../../models/tag";
import { VideoMeta } from "../../models/video_meta";
import { PlaylistVideoFinder } from "../../lib/videos_lib/playlist_video_finder";

const DynamicPlaylistVideo = async (req: Request, res: Response): Promise<VideoMeta | undefined> => {
  try {
    console.log("entered dynamic playlist video:", req.params);
    const id = +req.params.id;
    const order = +req.params.order;
    const tag_repo = getRepository(Tag);
    const playlist = await tag_repo.findOne(id, { relations: ["child_tags", "persistent_query_to_playlists", "playlist_included_tags"] });
    if (!playlist || !playlist.is_dynamic_playlist) {
      res.status(404).send("playlist not found");
      return undefined;
    }
    const finder_res = await PlaylistVideoFinder.find_video_or_next(playlist, order);
    if (!finder_res) {
      res.status(404).send("no video found in playlist");
      return undefined;
    }
    // const video = finder_res.video;
    // const persistent_query = finder_res.persistent_query;
    // const next = finder_res.next_video_index;
    // const playlist_length = finder_res.playlist_length;
    res.status(200).send(finder_res);
  } catch (err) {
    console.log(err);
  }
};

export default DynamicPlaylistVideo;
