import axiosClient from "./axiosClient";
import { normalizeList } from "./responseHelper";

const phuongtienhuhongApi = {
  // list damaged vehicles (reuse qlpt/phuongtien endpoint)
  getList: async (params) => {
    const url = "/qlpt/phuongtien";
    const resp = await axiosClient.get(url, { params });
    return normalizeList(resp);
  },
  // helper to request only hu_hong items
  getListHuHong: async (params) => {
    const url = "/qlpt/phuongtien";
    const newParams = { ...params, hu_hong: true };
    const resp = await axiosClient.get(url, { params: newParams });
    return normalizeList(resp);
  },
  get: (id) => {
    const url = `/qlpt/phuongtien/${id}`;
    return axiosClient.get(url);
  },
  // add damaged vehicle report (general name)
  add: (params) => {
    const url = "/qlpt/phuongtien/";
    // ensure hu_hong flag set so backend can identify damaged record
    const payload = { ...params, hu_hong: true };
    return axiosClient.post(url, payload);
  },
  // explicit name requested
  addPhuongtienHuHong: (params) => {
    return phuongtienhuhongApi.add(params);
  },
};

export default phuongtienhuhongApi;
