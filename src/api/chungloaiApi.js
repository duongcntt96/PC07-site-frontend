import axiosClient from "./axiosClient";

const chungloaiApi = {
  getAll: (params) => {
    const url = "/phuongtien/chungloai";
    return axiosClient.get(url, { params });
  },
  get: (id) => {
    const url = `/phuongtien/chungloai/${id}`;
    return axiosClient.get(url);
  },
};

export default chungloaiApi;
