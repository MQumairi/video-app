import axios from "axios";
import IDirectory from "../models/directory";
import IDirectorySearchResult from "../models/directory_search_result";
import ISeries from "../models/series";
import ITag, { ITagCreate, ITagEdit } from "../models/tag";
import IVideoMeta from "../models/video_meta";
import IImageMeta from "../models/image_meta";
import IImageGallery from "../models/image_gallery";
import IFileScript from "../models/file_script";
import IPersistentQuery, { IPersistentQueryCreate } from "../models/persistent_query";

const server_host = process.env.REACT_APP_SERVER_HOST ?? "localhost";
const server_port = process.env.REACT_APP_SERVER_PORT ?? 5000;
export const server_url = `http://${server_host}:${server_port}`;
export const base_url = `${server_url}/api`;

axios.defaults.baseURL = base_url;

export const Directory = {
  get: async (dir_path: string): Promise<IDirectory> => (await axios.get(`directories/${dir_path}`)).data,
  search: async (query: string): Promise<IDirectorySearchResult> => (await axios.get(`directories/search/${query}`)).data,
};

export const Video = {
  // /:filepath/metadata
  details_from_path: async (video_path: string) => axios.get(`videos/${video_path}/metadata`),
  details: async (video_id: number) => axios.get(`videos/${video_id}`),
  rate: async (video: IVideoMeta, rating: number) => axios.put(`videos/${video.id}/rate`, { rating }),
  edit: async (updated_video: IVideoMeta) => axios.put(`videos/${updated_video.id}`, updated_video),
  thumb_video: async (video: IVideoMeta, image: IImageMeta) => axios.put(`videos/${video.id}/add-thumbnail`, { image_id: image.id }),
  gallery: async (video: IVideoMeta) => axios.get(`videos/${video.id}/gallery`),
  delete: async (video: IVideoMeta) => axios.delete(`videos/${video.id}`),
  tags: async (video: IVideoMeta) => axios.get(`videos/${video.id}/tags`),
  similar: async (video: IVideoMeta) => axios.get(`videos/${video.id}/similar`),
  scripts: async (video: IVideoMeta) => axios.get(`videos/${video.id}/scripts`),
  reprocess: async (video: IVideoMeta) => axios.put(`videos/${video.id}/process-meta-data`),
  popular: async () => axios.get(`videos/popular`),
  latest: async () => axios.get(`videos/latest`),
  discover: async () => axios.get(`videos/discover`),
  // process-meta-data
};

export const Search = {
  search_vidoes: async (search_param: string) => axios.get(`search?${search_param}`),
  search_galleries: async (search_param: string) => await axios.get(`search/galleries?${search_param}`),
  shuffle: async (search_param: string): Promise<IVideoMeta> => (await axios.get(`search/shuffle?${search_param}`)).data,
  tag_results: async (search_param: string, tags_to_apply: ITag[]) => axios.put(`search/tag-resuts?${search_param}`, { tags: tags_to_apply }),
};

export const Tag = {
  get: async () => axios.get(`tags`),
  characters: async () => axios.get(`tags/characters`),
  studios: async () => axios.get(`tags/studios`),
  other: async () => axios.get(`tags/uncategorized`),
  playlists: async () => axios.get(`tags/playlists`),
  shuffle: async (tag_id: number) => axios.get(`tags/${tag_id}/shuffle`),
  random_images: async (tag: ITag) => axios.get(`tags/${tag.id}/images`),
  random_image_single: async (tag: ITag) => axios.get(`tags/${tag.id}/image-slide`),
  post: async (tag: ITagCreate) => axios.post(`tags`, tag),
  details: async (tag_id: number, search_params: string = "") => axios.get(`tags/${tag_id}?${search_params}`),
  edit: async (tag: ITagEdit) => axios.put(`tags/${tag.id}`, tag),
  tag_video: async (video: IVideoMeta, tags: ITag[]) => axios.put(`tags/tag-single-video`, { video, tags }),
  tag_videos: async (videos: IVideoMeta[], tags: ITag[]) => axios.put(`tags/tag-videos`, { videos: videos, tags: tags }),
  untag_video: async (videos: IVideoMeta[], tag: ITag) => axios.put(`tags/untag-videos`, { videos: videos, tag: tag }),
  add_children: async (tag: ITag, child_tags: ITag[]) => axios.put(`tags/${tag.id}/children/add`, { tag: tag, child_tags: child_tags }),
  remove_children: async (tag: ITag, child_tags: ITag[]) => axios.put(`tags/${tag.id}/children/remove`, { tag: tag, child_tags: child_tags }),
  delete: async (tag: ITag) => axios.delete(`tags/${tag.id}`),
  generate_video_thumbnails: async (tag: ITag) => axios.put(`tags/generate-video-thumbnails`, tag),
};

export const Series = {
  get: async () => axios.get(`series`),
  post: async (series_name: string) => axios.post(`series`, { name: series_name }),
  details: async (series_id: number) => axios.get(`series/${series_id}`),
  add_video: async (updated_series: ISeries) => axios.put(`series/${updated_series.id}/video/add`, updated_series),
  remove_video: async (updated_series: any) => axios.put(`series/${updated_series.id}/video/remove`, updated_series),
  delete: async (series_id: number) => axios.delete(`series/${series_id}`),
};

export const FileScripts = {
  get: async () => axios.get(`file-scripts`),
  details: async (script_id: number) => axios.get(`file-scripts/${script_id}`),
  videos: async (script: IFileScript) => axios.get(`file-scripts/${script.id}/videos`),
  media_count: async (script: IFileScript) => axios.get(`file-scripts/${script.id}/media-count`),
  associate_media_with_tag: async (script: IFileScript, tag_id: number) => axios.put(`file-scripts/${script.id}/associate-with-all-tagged-media`, { tag_id }),
  associate_video: async (script: IFileScript, video: IVideoMeta) => axios.put(`file-scripts/${script.id}/associate-with-video`, { video }),
  associate_gallery: async (script: IFileScript, gallery: IImageGallery) => axios.put(`file-scripts/${script.id}/associate-with-gallery`, { gallery }),
  execute_manual_script_on_all: async (script: IFileScript) => axios.put(`file-scripts/${script.id}/execute-manual-script-on-all-media`),
  execute_global_script: async (script: IFileScript, args: string) => axios.put(`file-scripts/${script.id}/execute-global-script`, { args }),
  execute_video_script: async (script: IFileScript, video: IVideoMeta) => axios.put(`file-scripts/${script.id}/execute-video-script`, { video }),
  execute_gallery_script: async (script: IFileScript, gallery: IImageGallery) => axios.put(`file-scripts/${script.id}/execute-gallery-script`, { gallery }),
  edit: async (script: IFileScript) => axios.put(`file-scripts/${script.id}/edit`, { script }),
  remove_video: async (script: IFileScript, video: IVideoMeta) => axios.put(`file-scripts/${script.id}/remove-video`, { video }),
};

export const PersistentQueries = {
  list: async () => axios.get(`persistent-queries`),
  create: async (query: IPersistentQueryCreate) => axios.post(`persistent-queries`, query),
  details: async (query_id: number) => axios.get(`persistent-queries/${query_id}`),
  delete: async (query: IPersistentQuery) => axios.delete(`persistent-queries/${query.id}`),
  preview_videos: async (query: IPersistentQuery) => axios.get(`persistent-queries/${query.id}/preview-videos`),
};

export const Cleanup = {
  delete_missing_videos: async () => axios.get(`cleanup/missing-videos`),
  new_videos: async () => axios.get(`cleanup/new-videos`),
  delete_duplicate_tags: async () => axios.get(`cleanup/duplicate-tags`),
  cleanup_thumbs: async () => axios.get(`cleanup/thumbnails`),
  cleanup_video_file_meta: async () => axios.get(`cleanup/video-file-meta`),
  cleanup_file_scripts: async () => axios.get(`cleanup/file-scripts`),
  cleanup_galleries: async () => axios.get(`cleanup/galleries`),
  cleanup_images: async () => axios.get(`cleanup/images`),
};

export const Gallery = {
  upload: async (data: FormData) => axios.post(`galleries/upload-for-video`, data),
  from_video: async (video: IVideoMeta) => axios.post(`galleries/from-video`, { video_id: video.id }),
  pair: async (video: IVideoMeta, gallery_id: number) => axios.put(`galleries/pair-to-video`, { video_id: video.id, gallery_id }),
  details: async (gallery_id: number) => axios.get(`galleries/${gallery_id}`),
  delete: async (gallery: IImageGallery) => axios.delete(`galleries/${gallery.id}`),
  get_image: async (image_id: number) => axios.get(`galleries/image/${image_id}`),
  delete_image: async (image: IImageMeta) => axios.delete(`galleries/image/${image.id}`),
};
