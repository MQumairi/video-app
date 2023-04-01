import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { FileScript } from "../../models/file_script";
import { ImageGallery } from "../../models/image_gallery";

const AssociateGallery = async (req: Request, res: Response): Promise<FileScript | undefined> => {
  const id = +req.params.id;
  const file_script_repo = getRepository(FileScript);
  const script = await file_script_repo.findOne(id);
  if (!script || script.is_global_script) {
    res.status(404).send({ message: "file script not found" });
    return;
  }
  const req_gallery: ImageGallery = req.body.video;
  const gallery_repo = getRepository(ImageGallery);
  const gallery = await gallery_repo.findOne(req_gallery);
  if (!gallery) {
    res.status(404).send({ message: "gallery not found" });
    return;
  }
  await FileScript.associate_script_to_gallery(script, gallery);
  res.status(200).send(script);
  return script;
};

export default AssociateGallery;
