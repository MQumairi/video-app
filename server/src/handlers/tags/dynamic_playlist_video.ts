import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Tag } from "../../models/tag";
import { VideoMeta } from "../../models/video_meta";
import { VideoSearcher } from "../../lib/videos_lib/video_searcher";
import { PersistentQuery } from "../../models/persistent_query";

const next_video_index = (current_order: number, playlist_length: number): number => {
  const next_index = current_order + 1;
  if (next_index >= playlist_length) return 0;
  return next_index;
};

const DynamicPlaylistVideo = async (req: Request, res: Response): Promise<VideoMeta | undefined> => {
  console.log("entered tag shuffle");
  const id = +req.params.id;
  const order = +req.params.order;
  const tag_repo = getRepository(Tag);
  const tag = await tag_repo.findOne(id, { relations: ["child_tags", "persistent_query_to_playlists"] });
  if (!tag || !tag.is_dynamic_playlist) {
    res.status(404).send("Tag not found");
    return undefined;
  }
  const persistent_queries = await Tag.get_dynamic_playlist_queries(tag);
  if (persistent_queries.length <= order) {
    res.status(404).send(`Video at index ${order}, not found`);
    return undefined;
  }
  const persistent_query = persistent_queries[order];
  const search_query = PersistentQuery.build_search_query(persistent_query);
  const seacher = new VideoSearcher(search_query);
  const video = await seacher.random_single_video();
  const next = next_video_index(order, persistent_queries.length);
  res.status(200).send({ video, next });
  return video;
};

export default DynamicPlaylistVideo;
