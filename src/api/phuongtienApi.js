import axiosClient from "./axiosClient";
import { normalizeList } from "./responseHelper";
const phuongtienApi = {
  getAll: async (params) => {
    const url = "/phuongtien/phuongtien";
    const resp = await axiosClient.get(url, { params });
    return normalizeList(resp);
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

  getListTrangThai: async () => {
    const url = `/phuongtien/trangthai/`;
    const resp = await axiosClient.get(url);
    return normalizeList(resp);
  },

  getListChatLuong: async () => {
    const url = `/phuongtien/chatluong/`;
    const resp = await axiosClient.get(url);
    return normalizeList(resp);
  },

  getListTo: async () => {
    const url = `/phuongtien/to/`;
    const resp = await axiosClient.get(url);
    return normalizeList(resp);
  },

  getListImage: async (params) => {
    const url = `/phuongtien/image/`;
    const resp = await axiosClient.get(url, { params });
    return normalizeList(resp);
  },

  addImage: (params) => {
    const url = `/phuongtien/image/`;
    return axiosClient.post(url, params);
  },
};

export default phuongtienApi;
