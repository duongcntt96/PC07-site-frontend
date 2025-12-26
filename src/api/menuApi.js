import axiosClient from "./axiosClient";
import { normalizeList } from "./responseHelper";

const menuApi = {
  // Fetch header/menu items from backend
  getHeader: async (params) => {
    const url = "/site/menu"; // backend endpoint, adjust if needed
    const resp = await axiosClient.get(url, { params });
    return normalizeList(resp);
  },
};

export default menuApi;
