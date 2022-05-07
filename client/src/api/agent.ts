import axios from "axios";
import IDirectory from "../models/directory";
import IDirectorySearchResult from "../models/directory_search_result";
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
};

export const Tag = {
  get: async () => axios.get(`tags`),
  post: async (video_meta: IVideoMeta) => axios.post(`tags`, video_meta),
  details: async (tag_id: number) => axios.get(`tags/${tag_id}`),
  shuffle: async (tag_id: number) => axios.get(`tags/${tag_id}/shuffle`),
  add_video: async (updated_tag: ITag) => axios.put(`tags/${updated_tag.id}/video/add`, updated_tag),
};
