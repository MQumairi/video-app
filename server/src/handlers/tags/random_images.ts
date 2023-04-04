import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { ImageMeta } from "../../models/image_meta";
import { Tag } from "../../models/tag";
import { PAGE_CAPACITY } from "../../lib/media_searcher";
import { ImagePreprocessor } from "../../lib/images_lib/image_preprocessor";

const RandomImages = async (req: Request, res: Response): Promise<ImageMeta[]> => {
  try {
    console.log("entered RandomImages");
    const tag_id = +req.params.id;
    const found_tag = await getRepository(Tag).findOne(tag_id);
    if (!found_tag) {
      res.status(404).send({ message: "tag not found" });
      return [];
    }
    const image_repo = getRepository(ImageMeta);
    const tag_images = await image_repo
      .createQueryBuilder("image")
      .addGroupBy("image.id")
      .leftJoinAndSelect("image.gallery", "gallery")
      .addGroupBy("gallery.id")
      .leftJoinAndSelect("gallery.tags", "tag")
      .addGroupBy("tag.id")
      .leftJoinAndSelect("image.file_scripts", "file_script")
      .addGroupBy("file_script.id")
      .where("tag.name IN (:found_tag_name)", { found_tag_name: found_tag.name })
      .orderBy("RANDOM()")
      .limit(PAGE_CAPACITY)
      .getMany();
    await ImagePreprocessor.process_images(tag_images);
    res.status(200).send(tag_images);
    return tag_images;
  } catch (err) {
    res.status(500).send([]);
    return [];
  }
};

export default RandomImages;
