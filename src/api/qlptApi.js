import axiosClient from "./axiosClient";
import { normalizeList } from "./responseHelper";
const qlptApi = {
  textToMp3: (params) => {
    const url = "/qlpt/texttospeak";
    return axiosClient.get(url, { params });
  },
  getListChungloai: async (params) => {
    const url = "/qlpt/chungloai";
    const resp = await axiosClient.get(url, { params });
    return normalizeList(resp);
  },
  getListKho: async (params) => {
    const url = "/qlpt/kho";
    const resp = await axiosClient.get(url, { params });
    return normalizeList(resp);
  },
  getListNguoncap: async (params) => {
    const url = "/qlpt/nguoncap";
    const resp = await axiosClient.get(url);
    return normalizeList(resp);
  },
  getListPhuongtien: async (params) => {
    const url = "/qlpt/phuongtien";
    const resp = await axiosClient.get(url, { params });
    return normalizeList(resp);
  },
  getPhuongtien: (id) => {
    const url = `/qlpt/phuongtien/${id}`;
    return axiosClient.get(url);
  },
  getListPhieunhap: async (params) => {
    const url = "/qlpt/phieunhap";
    const resp = await axiosClient.get(url, { params });
    return normalizeList(resp);
  },
  getPhieunhap: (id) => {
    const url = `/qlpt/phieunhap/${id}`;
    return axiosClient.get(url);
  },
  getChitietPhieunhap: async (params) => {
    const url = `/qlpt/chitietphieunhap/`;
    const resp = await axiosClient.get(url, { params });
    return normalizeList(resp);
  },
  addPhieunhap: (params) => {
    const url = "/qlpt/phieunhap/";
    return axiosClient.post(url, params);
  },
  addPhuongtien: (params) => {
    const url = "/qlpt/phuongtien/";
    return axiosClient.post(url, params);
  },
  updatePhieunhap: (params) => {
    const url = `/qlpt/phieunhap/${params.id}/`;
    return axiosClient.put(url, params);
  },

  updatePhuongtien: (params) => {
    const url = `/qlpt/phuongtien/${params.id}/`;
    return axiosClient.put(url, params);
  },

  delPhieunhap: (id) => {
    const url = `/qlpt/phieunhap/${id}`;
    return axiosClient.delete(url);
  },
  addChitietPhieunhap: (params) => {
    const url = "/qlpt/chitietphieunhap/";
    return axiosClient.post(url, params);
  },
  delChitietPhieunhap: (id) => {
    const url = `/qlpt/chitietphieunhap/${id}`;
    return axiosClient.delete(url);
  },
};

export default qlptApi;
