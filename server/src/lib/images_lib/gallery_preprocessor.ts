import { FileScript } from "../../models/file_script";
import { ImageGallery } from "../../models/image_gallery";
import { ImageMeta } from "../../models/image_meta";

export class GalleryPreProcessor {
  static async process_gallery(gallery: ImageGallery) {
    console.log("preprocessing gallery...");
    for (let img of gallery.images) {
      await GalleryPreProcessor.process_image(img);
    }
  }
  static async process_image(image: ImageMeta) {
    if (image.file_scripts == null) return;
    for (let script of image.file_scripts) {
      if (!script.is_start_script) continue;
      console.log(`(${image.id}) found start script: ${script.name}`);
      await FileScript.execute_script(script, image.path);
    }
  }
}
