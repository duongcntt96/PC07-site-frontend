import axiosClient from "./axiosClient";

const cosoApi = {
  getAll: (params) => {
    const url = "/coso/coso";
    return axiosClient.get(url, { params });
  },
  get: (id) => {
    const url = `/coso/coso/${id}`;
    return axiosClient.get(url);
  },
  getListDiaban: (id) => {
    const url = `/coso/diaban`;
    return axiosClient.get(url);
  },
  getListLoaihinh: (id) => {
    const url = `/coso/loaihinh`;
    return axiosClient.get(url);
  },
  getListHuanluyen: (id) => {
    const url = `/coso/huanluyen`;
    return axiosClient.get(url);
  },
};

export default cosoApi;
