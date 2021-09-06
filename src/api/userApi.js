import axiosClient from "./axiosClient";

const userApi = {
  login: ({ username, password }) => {
    const url = "/user/login";
    return axiosClient.post(url, { username, password });
  },

  register: ({ username, password, email }) => {
    const url = "/user/register";
    return axiosClient.post(url, { username, password, email });
  },
};

export default userApi;
