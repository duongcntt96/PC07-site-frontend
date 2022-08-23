import axiosClient from "./axiosClient";
const phuongtienApi = {
  getAll: (params) => {
    const url = "/phuongtien/phuongtien";
    return axiosClient.get(url, { params });
  },
  get: (id) => {
    const url = `/phuongtien/phuongtien/${id}`;
    return axiosClient.get(url);
  },
  addChild: (params) => {
    const url = `/phuongtien/phuongtien/`;
    return axiosClient.post(url, params);
  },
  search: (text) => {
    const url = `/phuongtien/phuongtien/?search=${text}`;
    return axiosClient.get(url);
  },

  getListTrangThai: () => {
    const url = `/phuongtien/trangthai/`;
    return axiosClient.get(url);
  },

  getListChatLuong: () => {
    const url = `/phuongtien/chatluong/`;
    return axiosClient.get(url);
  },

  getListTo: () => {
    const url = `/phuongtien/to/`;
    return axiosClient.get(url);
  },

  getListImage: (params) => {
    const url = `/phuongtien/image/`;
    return axiosClient.get(url, { params });
  },

  addImage: (params) => {
    const url = `/phuongtien/image/`;
    return axiosClient.post(url, params);
  },
};

export default phuongtienApi;
