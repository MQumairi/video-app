import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { ImageGallery } from "../../models/image_gallery";
import { ImagePreprocessor } from "../../lib/images_lib/image_preprocessor";

const Details = async (req: Request, res: Response): Promise<ImageGallery | undefined> => {
  try {
    console.log("entered gallery details");
    const id = +req.params.id;
    console.log("looking for gallery of id", id);
    const gallery = await getRepository(ImageGallery).findOne(id, { relations: ["thumbnail", "tags"] });
    if (!gallery) {
      res.status(404).send("gallery not found");
      return;
    }
    await ImagePreprocessor.process_gallery(gallery);
    const images = gallery.images.sort((i1, i2) => {
      return i1.timestamp_secs - i2.timestamp_secs;
    });
    gallery.images = images;
    res.status(200).send(gallery);
    return gallery;
  } catch (err) {
    console.log("rescued error:", err);
  }
};

export default Details;
