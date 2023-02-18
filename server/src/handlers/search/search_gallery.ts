import { Request, Response } from "express";
import { MediaSearcher } from "../../lib/media_searcher";
import { ImageGallery } from "../../models/image_gallery";
import { SearchQuery } from "../../lib/search_query";

const SearchGallery = async (req: Request, res: Response): Promise<ImageGallery[]> => {
  const search_query = await SearchQuery.from_request(req);
  const media_searcher = new MediaSearcher(search_query);
  const [galleries, count] = await media_searcher.gallery_search_results();
  console.log("count is:", count);
  console.log("galleries returned:", galleries.length);
  res.status(200).send({ galleries: galleries, count: count });
  return galleries;
};

export default SearchGallery;
