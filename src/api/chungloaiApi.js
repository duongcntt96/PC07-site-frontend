import axiosClient from "./axiosClient";
import { normalizeList } from "./responseHelper";

const chungloaiApi = {
  getAll: async (params) => {
    const url = "/phuongtien/chungloai";
    const resp = await axiosClient.get(url, { params });
    return normalizeList(resp);
  },
  get: (id) => {
    const url = `/phuongtien/chungloai/${id}`;
    return axiosClient.get(url);
  },
};

export default chungloaiApi;
