import axiosClient from "./axiosClient";

const phuongtienhuhongApi = {
  // list damaged vehicles (reuse qlpt/phuongtien endpoint)
  getList: (params) => {
    const url = "/qlpt/phuongtien";
    return axiosClient.get(url, { params });
  },
  // helper to request only hu_hong items
  getListHuHong: (params) => {
    const url = "/qlpt/phuongtien";
    const newParams = { ...params, hu_hong: true };
    return axiosClient.get(url, { params: newParams });
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
