import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Tag } from "../../models/tag";
import { SearchQuery } from "../../lib/search_query";
import { MediaSearcher } from "../../lib/media_searcher";

const Details = async (req: Request, res: Response): Promise<Tag | undefined> => {
  console.log("entered playlists details");
  const id = +req.params.id;
  const tag_repo = getRepository(Tag);
  const playlist = await tag_repo.findOne(id);
  if (!playlist) {
    res.status(404).send("Playlist not found");
    return undefined;
  }
  const query = new SearchQuery([playlist]);
  const seacher = new MediaSearcher(query);
  const [videos, count] = await seacher.video_search_results();
  playlist.videos = videos;
  res.status(200).send(playlist);
  return playlist;
};

export default Details;
