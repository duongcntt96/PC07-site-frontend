import axiosClient from "./axiosClient";
const qlptApi = {
  getListChungloai: (params) => {
    const url = "/qlpt/chungloai";
    return axiosClient.get(url, { params });
  },
  getListKho: (params) => {
    const url = "/qlpt/kho";
    return axiosClient.get(url, { params });
  },
  getListNguoncap: (params) => {
    const url = "/qlpt/nguoncap";
    return axiosClient.get(url);
  },
  getListPhuongtien: (params) => {
    const url = "/qlpt/phuongtien";
    return axiosClient.get(url, { params });
  },
  getPhuongtien: (id) => {
    const url = `/qlpt/phuongtien/${id}`;
    return axiosClient.get(url);
  },
  getListPhieunhap: (params) => {
    const url = "/qlpt/phieunhap";
    return axiosClient.get(url, { params });
  },
  getPhieunhap: (id) => {
    const url = `/qlpt/phieunhap/${id}`;
    return axiosClient.get(url);
  },
  getChitietPhieunhap: (params) => {
    const url = `/qlpt/chitietphieunhap/`;
    return axiosClient.get(url, { params });
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
