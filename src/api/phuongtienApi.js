import axiosClient from "./axiosClient";
const phuongtienApi = {
  getAll: (params) => {
    const url = "/phuongtien";
    return axiosClient.get(url, { params });
  },
  get: (id) => {
    const url = `/phuongtien/${id}`;
    return axiosClient.get(url);
  },
  getChildren: (id) => {
    const url = `/phuongtien/children?parentID=${id}`;
    return axiosClient.get(url);
  },
  search: (text) => {
    const url = `/phuongtien/?search=${text}`;
    return axiosClient.get(url);
  },
};

export default phuongtienApi;
