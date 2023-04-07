import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { ImageMeta } from "../../models/image_meta";
import { ImageFileProbber } from "../../lib/images_lib/image_file_probber";

const CleanupImages = async (req: Request, res: Response) => {
  console.log("entered CleanupImages");
  const image_repo = getRepository(ImageMeta);
  const images = await image_repo.find();
  const counter = { changed: 0, unchanged: 0 };
  for (let img of images) {
    console.log(`processing img ${img.id}, path: ${img.path}`);
    if (img.width > 0 && img.height > 0) {
      counter.unchanged += 1;
      continue;
    }
    const dimensions = await ImageFileProbber.get_image_size(img);
    img.width = dimensions.width;
    img.height = dimensions.height;
    await image_repo.save(img);
    counter.changed += 1;
  }
  console.log("finished cleanup images");
  console.log(counter);
};

export default CleanupImages;
