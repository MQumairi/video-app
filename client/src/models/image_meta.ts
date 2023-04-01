import IImageGallery from "./image_gallery";

export default interface IImageMeta {
  id: number;
  path: string;
  order_number: number;
  gallery: IImageGallery;
  timestamp_secs?: number;
  width: number;
  height: number;
}
