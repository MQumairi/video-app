import { FileScript } from "../../models/file_script";
import { ImageGallery } from "../../models/image_gallery";
import { ImageMeta } from "../../models/image_meta";
import { VideoMeta } from "../../models/video_meta";
import { ImageFileProbber } from "./image_file_probber";

export class ImagePreprocessor {
  static async process_gallery(gallery: ImageGallery) {
    for (let img of gallery.images) {
      await ImagePreprocessor.process_image(img);
    }
  }

  static async process_images(images: ImageMeta[]) {
    for (const img of images) {
      await ImagePreprocessor.process_image(img);
    }
  }

  static async process_video_thumbs(videos: VideoMeta[]) {
    for (let v of videos) {
      if (v.thumbnail === null) continue;
      await ImagePreprocessor.process_image(v.thumbnail);
    }
  }

  static async process_gallery_thumbs(galleries: ImageGallery[]) {
    for (let g of galleries) {
      if (g.thumbnail === null) continue;
      await ImagePreprocessor.process_image(g.thumbnail);
    }
  }

  static async process_image(image: ImageMeta) {
    if (image.file_scripts === null) return;
    for (let script of image.file_scripts) {
      if (script.is_start_script) await FileScript.execute_script(script, image.path);
      if (image.width === 0 || image.height === 0) await ImageFileProbber.save_image_size(image);
    }
  }
}
