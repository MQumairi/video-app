import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Tag } from "../../models/tag";
import { VideoMeta } from "../../models/video_meta";
import { VideoSearcher } from "../../lib/videos_lib/video_searcher";
import { PersistentQuery } from "../../models/persistent_query";

const next_video_index = (current_order: number, playlist_length: number): number => {
  const next_index = current_order + 1;
  if (next_index > playlist_length) return 1;
  return next_index;
};

const DynamicPlaylistVideo = async (req: Request, res: Response): Promise<VideoMeta | undefined> => {
  try {
    console.log("entered tag shuffle");
    const id = +req.params.id;
    const order = +req.params.order;
    const tag_repo = getRepository(Tag);
    const tag = await tag_repo.findOne(id, { relations: ["child_tags", "persistent_query_to_playlists", "playlist_included_tags"] });
    if (!tag || !tag.is_dynamic_playlist) {
      res.status(404).send("Tag not found");
      return undefined;
    }
    const persistent_queries = await PersistentQuery.find_by_order(tag, order);
    if (persistent_queries.length === 0) {
      await Tag.update_dynamic_playlist_query_orders(tag);
      res.status(404).send(`Video at index ${order}, not found`);
      return undefined;
    }
    const persistent_query = persistent_queries[0];
    // Add playlist_included_tags if they exist
    const playlist_included_tags = tag.playlist_included_tags;
    if (playlist_included_tags.length) {
      persistent_query.included_tags.push(...playlist_included_tags);
    }
    const search_query = await PersistentQuery.build_search_query(persistent_query);
    const seacher = new VideoSearcher(search_query);
    const video = await seacher.random_single_video();
    const playlist_length = (await Tag.get_dynamic_playlist_queries(tag)).length;
    const next = next_video_index(order, playlist_length);
    res.status(200).send({ video, next, playlist_length, persistent_query });
    return video;
  } catch (err) {}
};

export default DynamicPlaylistVideo;
