import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { ImageGallery } from "../../models/image_gallery";

const Delete = async (req: Request, res: Response) => {
  const id = +req.params.id;
  const gallery_repo = getRepository(ImageGallery);
  const gallery = await gallery_repo.findOne(id);
  if (!gallery) {
    res.status(404).send({ message: `failed to remove gallery ${id}, gallery missing` });
    return;
  }
  const delete_successful = await ImageGallery.delete_gallery(gallery);
  if (!delete_successful) {
    res.status(500).send({ message: `failed to remove gallery ${id} server error` });
    return;
  }
  res.status(200).send({ message: `removed gallery ${gallery.id}` });
};

export default Delete;
