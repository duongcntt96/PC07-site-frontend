import axiosClient from "./axiosClient";
import { normalizeList } from "./responseHelper";

const cosoApi = {
  getAll: (params) => {
    const url = "/coso/coso";
    return axiosClient.get(url, { params });
  },
  get: (id) => {
    const url = `/coso/coso/${id}`;
    return axiosClient.get(url);
  },
  getListDiaban: async (id) => {
    const url = `/coso/diaban`;
    const resp = await axiosClient.get(url);
    return normalizeList(resp);
  },
  getListLoaihinh: async (id) => {
    const url = `/coso/loaihinh`;
    const resp = await axiosClient.get(url);
    return normalizeList(resp);
  },
  getListHuanluyen: async (id) => {
    const url = `/coso/huanluyen`;
    const resp = await axiosClient.get(url);
    return normalizeList(resp);
  },
};

export default cosoApi;
