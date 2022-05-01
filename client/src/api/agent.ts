import axios from "axios";

axios.defaults.baseURL = "http://localhost:5000/api";

export const Directory = {
  get: async (dir_path: string) => axios.get(`directories/${dir_path}`),
};
