import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { ImageMeta } from "../../models/image_meta";

const ImageDetails = async (req: Request, res: Response): Promise<ImageMeta | undefined> => {
  const id = +req.params.id;
  const image = await getRepository(ImageMeta).findOne(id, { relations: ["gallery"] });
  if (!image) {
    res.status(404).send({ message: "image not found" });
    return;
  }
  res.status(200).send(image);
  return image;
};

export default ImageDetails;
