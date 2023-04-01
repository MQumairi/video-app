import { ImageMeta } from "../../models/image_meta";
import { promisify } from "util";
import imageSize from "image-size";
const sizeOf = promisify(imageSize);

interface ImageResolution {
  width: number;
  height: number;
}

export class ImageFileProbber {
  image: ImageMeta;

  constructor(image: ImageMeta) {
    this.image = image;
  }

  async get_image_size(): Promise<ImageResolution> {
    const default_dims = { width: 0, height: 0 };
    try {
      const dimensions = await sizeOf(this.image.path);
      if (!dimensions || !dimensions.width || !dimensions.height) return default_dims;
      return { width: dimensions.width, height: dimensions.height };
    } catch (err) {
      console.log("rescued err:", err);
      return default_dims;
    }
  }
}
