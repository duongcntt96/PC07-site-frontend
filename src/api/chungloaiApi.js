import axiosClient from "./axiosClient";
import { normalizeList } from "./responseHelper";

const chungloaiApi = {
  getAll: async (params) => {
    const url = "/qlpt/chungloai/";
    const resp = await axiosClient.get(url, { params });
    return normalizeList(resp);
  },
  get: (id) => {
    const url = `/qlpt/chungloai/${id}`;
    return axiosClient.get(url);
  },
};

export default chungloaiApi;
