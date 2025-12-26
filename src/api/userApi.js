import axios from "axios";
import axiosClient from "./axiosClient";
import { normalizeList } from "./responseHelper";

const userApi = {
  login: ({ username, password }) => {
    const url = process.env.REACT_APP_API_URL + "/user/login";
    return axios.post(url, { username, password });
  },

  register: ({ username, first_name, password, email }) => {
    const url = process.env.REACT_APP_API_URL + "/user/register";
    return axios.post(url, { username, first_name, password, email });
  },

  getAllTeams: async (params) => {
    const url = "/user/team";
    const resp = await axiosClient.get(url, { params });
    return normalizeList(resp);
  },

  getAllUsers: async (params) => {
    const url = "/user/user";
    const resp = await axiosClient.get(url, { params });
    return normalizeList(resp);
  },

  getUser: (id) => {
    const url = `/user/user/${id}`;
    return axiosClient.get(url);
  },
  getUserProfile: (id) => {
    const url = `/user/profile/${id}`;
    return axiosClient.get(url);
  },

  // login: ({ username, password }) => {
  //   const url = "/user/login";
  //   return axiosClient.post(url, { username, password });
  // },

  // register: ({ username, password, email }) => {
  //   const url = "/user/register";
  //   return axiosClient.post(url, { username, password, email });
  // },
};

export default userApi;
