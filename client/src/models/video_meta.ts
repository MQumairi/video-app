import IFileScript from "./file_script";
import IImageGallery from "./image_gallery";
import IImageMeta from "./image_meta";
import ISeries from "./series";
import ITag from "./tag";

export default interface IVideoMeta {
  id: number;
  name: string;
  path: string;
  parent_path: string;
  tags?: ITag[];
  rating: number;
  series_order: number;
  series?: ISeries;
  gallery?: IImageGallery;
  thumbnail?: IImageMeta;
  file_scripts?: IFileScript[];
  duration_sec?: number;
  width?: number;
  height?: number;
  created_at?: Date;
  size_mb: number;
  views: number;
}
