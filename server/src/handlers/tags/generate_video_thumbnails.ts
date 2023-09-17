import { Request, Response } from "express";
import { Tag } from "../../models/tag";
import { getRepository } from "typeorm";
import ThumbnailGenerator from "../../lib/images_lib/thumbnail_generator";
import { SearchQuery, ThumbStatus } from "../../lib/search_query";
import { VideoSearcher } from "../../lib/videos_lib/video_searcher";

const GenerateVideoThumbnails = async (req: Request, res: Response) => {
  console.log("enetered generate video thumbnails");
  //Try to create the object
  try {
    const req_tag_id: Tag = req.body.tag_id;
    const tag_repo = getRepository(Tag);
    const tag = await tag_repo.findOne(req_tag_id);
    if (!tag) {
      res.status(404).send("Failed to find tag");
      return;
    }
    console.log("tags is:", tag.name);
    const search_query = await SearchQuery.from_tag(req, tag, 100, ThumbStatus.noThumb);
    const video_searcher = new VideoSearcher(search_query);
    const videos = await video_searcher.video_objects();
    console.log(`will generated thumbs for ${videos.length} videos`);
    // Don't await to not block this request
    ThumbnailGenerator.thumb_videos(videos);
    res.status(200).send(`generating thumbs for ${videos.length} videos, belonging to tag ${tag.name}`);
  } catch (error) {
    //Upon failure, do the following
    res.status(409).send("Failed to create thumbnails, error:\n" + error);
  }
};

export default GenerateVideoThumbnails;
