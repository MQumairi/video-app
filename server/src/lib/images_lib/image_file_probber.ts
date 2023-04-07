import { ImageMeta } from "../../models/image_meta";
import { promisify } from "util";
import imageSize from "image-size";
import { getRepository } from "typeorm";
const sizeOf = promisify(imageSize);

interface ImageResolution {
  width: number;
  height: number;
}

export class ImageFileProbber {
  static async get_image_size(image: ImageMeta): Promise<ImageResolution> {
    const default_dims = { width: 0, height: 0 };
    try {
      const dimensions = await sizeOf(image.path);
      if (!dimensions || !dimensions.width || !dimensions.height) return default_dims;
      return { width: dimensions.width, height: dimensions.height };
    } catch (err) {
      console.log("rescued err:", err);
      return default_dims;
    }
  }

  static async save_image_size(image: ImageMeta): Promise<Boolean> {
    const dimensions = await ImageFileProbber.get_image_size(image);
    image.width = dimensions.width;
    image.height = dimensions.height;
    const image_repo = getRepository(ImageMeta);
    await image_repo.save(image);
    return true;
  }
}
