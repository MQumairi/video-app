import { Request, Response } from "express";
import { Tag } from "../../models/tag";
import { getRepository } from "typeorm";
import ThumbnailGenerator from "../../lib/images_lib/thumbnail_generator";

const GenerateVideoThumbnails = async (req: Request, res: Response) => {
  console.log("enetered generate video thumbnails");
  //Try to create the object
  try {
    const req_tag: Tag = req.body;
    const tag_repo = getRepository(Tag);
    const tag = await tag_repo.findOne(req_tag.id, { relations: ["videos"] });
    if (!tag) {
      res.status(404).send("Failed to find tag");
      return;
    }
    // Don't await to not block this request
    ThumbnailGenerator.thumb_videos(tag.videos);
  } catch (error) {
    //Upon failure, do the following
    res.status(409).send("Failed to create thumbnails, error:\n" + error);
  }
};

export default GenerateVideoThumbnails;
