import axios from "axios";
import IAdvancedSearchQuery from "../models/advanced_search_query";
import IDirectory from "../models/directory";
import IDirectorySearchResult from "../models/directory_search_result";
import IPlaylist from "../models/playlist";
import ITag from "../models/tag";
import IVideoMeta from "../models/video_meta";

const server_host = process.env.REACT_APP_SERVER_HOST ?? "localhost";
const server_port = process.env.REACT_APP_SERVER_PORT ?? 5000;
export const base_url = `http://${server_host}:${server_port}/api`;

axios.defaults.baseURL = base_url;

export const Directory = {
  get: async (dir_path: string): Promise<IDirectory> => (await axios.get(`directories/${dir_path}`)).data,
  search: async (query: string): Promise<IDirectorySearchResult> => (await axios.get(`directories/search/${query}`)).data,
  adv_search: async (query: IAdvancedSearchQuery): Promise<IVideoMeta[]> => (await axios.post(`directories/advanced-search`, query)).data,
  adv_search_shuffle: async (): Promise<IVideoMeta> => (await axios.get(`directories/advanced-search-shuffle`)).data,
};

export const Video = {
  // /:filepath/metadata
  get: async (vid_path: string) => axios.get(`videos/${vid_path}/metadata`),
  rate: async (vid_path: string, video_meta: IVideoMeta) => axios.put(`videos/${vid_path}/rate`, video_meta),
};

export const Tag = {
  get: async () => axios.get(`tags`),
  post: async (video_meta: IVideoMeta) => axios.post(`tags`, video_meta),
  details: async (tag_id: number) => axios.get(`tags/${tag_id}`),
  shuffle: async (tag_id: number) => axios.get(`tags/${tag_id}/shuffle`),
  add_video: async (updated_tag: ITag) => axios.put(`tags/${updated_tag.id}/video/add`, updated_tag),
  delete: async (tag_id: number) => axios.delete(`tags/${tag_id}`),
};

export const Playlist = {
  get: async () => axios.get(`playlists`),
  post: async (video_meta: IVideoMeta) => axios.post(`playlists`, video_meta),
  details: async (playlist_id: number) => axios.get(`playlists/${playlist_id}`),
  shuffle: async (playlist_id: number) => axios.get(`playlists/${playlist_id}/shuffle`),
  add_video: async (updated_playlist: IPlaylist) => axios.put(`playlists/${updated_playlist.id}/video/add`, updated_playlist),
  remove_video: async (updated_playlist: any) => axios.put(`playlists/${updated_playlist.id}/video/remove`, updated_playlist),
  delete: async (playlist_id: number) => axios.delete(`playlists/${playlist_id}`),
};
