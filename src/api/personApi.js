import axiosClient from "./axiosClient";

const personApi = {
  getAll: (params) => {
    const url = "/to";
    return axiosClient.get(url);
  },
  get: (id) => {
    const url = `/to/${id}`;
    return axiosClient.get(url);
  },
};

export default personApi;
