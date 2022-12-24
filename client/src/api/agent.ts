import axios from "axios";
import IAdvancedSearchQuery from "../models/advanced_search_query";
import IDirectory from "../models/directory";
import IDirectorySearchResult from "../models/directory_search_result";
import IPlaylist from "../models/playlist";
import ISeries from "../models/series";
import ITag from "../models/tag";
import IVideoMeta from "../models/video_meta";

const server_host = process.env.REACT_APP_SERVER_HOST ?? "localhost";
const server_port = process.env.REACT_APP_SERVER_PORT ?? 5000;
export const base_url = `http://${server_host}:${server_port}/api`;

axios.defaults.baseURL = base_url;

export const Directory = {
  get: async (dir_path: string): Promise<IDirectory> => (await axios.get(`directories/${dir_path}`)).data,
  search: async (query: string): Promise<IDirectorySearchResult> => (await axios.get(`directories/search/${query}`)).data,
};

export const Video = {
  // /:filepath/metadata
  get: async (vid_path: string) => axios.get(`videos/${vid_path}/metadata`),
  rate: async (vid_path: string, video_meta: IVideoMeta) => axios.put(`videos/${vid_path}/rate`, video_meta),
  edit: async (updated_video: IVideoMeta) => axios.put(`videos/${updated_video.id}`, updated_video),
};

export const Search = {
  set_query: async (query: IAdvancedSearchQuery): Promise<IAdvancedSearchQuery> => (await axios.post(`search/queries`, query)).data,
  get_query: async (): Promise<IAdvancedSearchQuery> => await axios.get(`search/queries`),
  search_vidoes: async (): Promise<IVideoMeta[]> => (await axios.get(`search`)).data,
  shuffle: async (): Promise<IVideoMeta> => (await axios.get(`search/shuffle`)).data,
};

export const Tag = {
  get: async () => axios.get(`tags`),
  post: async (tag_name: string) => axios.post(`tags`, { name: tag_name }),
  details: async (tag_id: number) => axios.get(`tags/${tag_id}`),
  shuffle: async (tag_id: number) => axios.get(`tags/${tag_id}/shuffle`),
  remove_video: async (updated_tag: ITag) => axios.put(`tags/${updated_tag.id}/video/remove`, updated_tag),
  tag_video: async (video: IVideoMeta, tags: ITag[]) => axios.put(`tags/tag-videos`, { videos: [video], tags: tags }),
  tag_videos: async (videos: IVideoMeta[], tags: ITag[]) => axios.put(`tags/tag-videos`, { videos: videos, tags: tags }),
  add_children: async (tag: ITag, child_tags: ITag[]) => axios.put(`tags/${tag.id}/children/add`, { tag: tag, child_tags: child_tags }),
  remove_children: async (tag: ITag, child_tags: ITag[]) => axios.put(`tags/${tag.id}/children/remove`, { tag: tag, child_tags: child_tags }),
  delete: async (tag_id: number) => axios.delete(`tags/${tag_id}`),
};

export const Playlist = {
  get: async () => axios.get(`playlists`),
  post: async (playlist_name: string) => axios.post(`playlists`, { name: playlist_name }),
  details: async (playlist_id: number) => axios.get(`playlists/${playlist_id}`),
  shuffle: async (playlist_id: number) => axios.get(`playlists/${playlist_id}/shuffle`),
  add_video: async (updated_playlist: IPlaylist) => axios.put(`playlists/${updated_playlist.id}/video/add`, updated_playlist),
  remove_video: async (updated_playlist: any) => axios.put(`playlists/${updated_playlist.id}/video/remove`, updated_playlist),
  delete: async (playlist_id: number) => axios.delete(`playlists/${playlist_id}`),
};

export const Series = {
  get: async () => axios.get(`series`),
  post: async (series_name: string) => axios.post(`series`, { name: series_name }),
  details: async (series_id: number) => axios.get(`series/${series_id}`),
  add_video: async (updated_series: ISeries) => axios.put(`series/${updated_series.id}/video/add`, updated_series),
  remove_video: async (updated_series: any) => axios.put(`series/${updated_series.id}/video/remove`, updated_series),
  delete: async (series_id: number) => axios.delete(`series/${series_id}`),
};
