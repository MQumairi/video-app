import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { ImageMeta } from "../../models/image_meta";

const ImageDelete = async (req: Request, res: Response) => {
  const id = +req.params.id;
  const image_repo = getRepository(ImageMeta);
  const image = await image_repo.findOne(id);
  if (!image) {
    res.status(404).send({ message: `failed to remove image ${id}, image missing` });
    return;
  }
  const delete_successful = await ImageMeta.delete_image(image);
  if (!delete_successful) {
    res.status(500).send({ message: `failed to remove gallery ${id} server error` });
    return;
  }
  res.status(200).send({ message: `removed gallery ${image.id}` });
};

export default ImageDelete;
