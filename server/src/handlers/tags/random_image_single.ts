import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { ImageMeta } from "../../models/image_meta";
import { Tag } from "../../models/tag";
import { ImagePreprocessor } from "../../lib/images_lib/image_preprocessor";

const RandomImageSingle = async (req: Request, res: Response): Promise<ImageMeta | undefined> => {
  try {
    console.log("entered RandomImageSingle");
    const tag_id = +req.params.id;
    const found_tag = await getRepository(Tag).findOne(tag_id);
    if (!found_tag) {
      res.status(404).send({ message: "tag not found" });
      return undefined;
    }
    const image_repo = getRepository(ImageMeta);
    const tag_image = await image_repo
      .createQueryBuilder("image")
      .addGroupBy("image.id")
      .leftJoinAndSelect("image.gallery", "gallery")
      .addGroupBy("gallery.id")
      .leftJoinAndSelect("gallery.tags", "tag")
      .addGroupBy("tag.id")
      .leftJoinAndSelect("image.file_scripts", "file_script")
      .addGroupBy("file_script.id")
      .where("tag.name IN (:found_tag_name)", { found_tag_name: found_tag.name })
      .andWhere("image.timestamp_secs IS NULL")
      .orderBy("RANDOM()")
      .getOne();
    if (!tag_image) throw "no image found";
    await ImagePreprocessor.process_images([tag_image]);
    res.status(200).send(tag_image);
    return tag_image;
  } catch (err) {
    res.status(404).send({ message: "no image found" });
    return undefined;
  }
};

export default RandomImageSingle;
