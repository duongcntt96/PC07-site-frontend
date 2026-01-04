import axiosClient from "./axiosClient";
import { normalizeList } from "./responseHelper";

const phuongtienhuhongApi = {
  // list damaged vehicles (reuse qlpt/phuongtien endpoint)
  getList: async (params) => {
    const url = "/qlpt/huhong/";
    const resp = await axiosClient.get(url, { params });
    return normalizeList(resp);
  },
  get: (id) => {
    const url = `/qlpt/huhong/${id}`;
    return axiosClient.get(url);
  },
  // add damaged vehicle report (general name)
  add: (params) => {
    const url = "/qlpt/huhong/";
    // ensure hu_hong flag set so backend can identify damaged record
    const payload = { ...params };
    return axiosClient.post(url, payload);
  },
};

export default phuongtienhuhongApi;
