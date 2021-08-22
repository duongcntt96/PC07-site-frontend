import axiosClient from "./axiosClient";

const chungloaiApi = {
  getAll: (params) => {
    const url = "/chungloai";
    return axiosClient.get(url, { params });
  },
  get: (id) => {
    const url = `/chungloai/${id}`;
    return axiosClient.get(url);
  },
};

export default chungloaiApi;
