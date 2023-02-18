import IImageMeta from "./image_meta";

export default interface IImageGallery {
  id: number;
  name: string;
  images: IImageMeta[];
  thumbnail?: IImageMeta;
}
