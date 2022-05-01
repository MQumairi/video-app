import axios from "axios";

export const base_url = "http://localhost:5000/api";

axios.defaults.baseURL = base_url;

export const Directory = {
  get: async (dir_path: string) => axios.get(`directories/${dir_path}`),
};

export const Video = {
  // /:filepath/metadata
  get: async (vid_path: string) => axios.get(`videos/${vid_path}/metadata`),
};
