import axios from "axios";
import axiosClient from "./axiosClient";

const userApi = {
  login: ({ username, password }) => {
    const url = process.env.REACT_APP_API_URL + "/user/login";
    return axios.post(url, { username, password });
  },

  register: ({ username, first_name, password, email }) => {
    const url = process.env.REACT_APP_API_URL + "/user/register";
    return axios.post(url, { username, first_name, password, email });
  },

  getBophan: (params) => {
    const url = "/user/bophan";
    return axiosClient.get(url);
  },

  getCapbac: (params) => {
    const url = "/user/capbac";
    return axiosClient.get(url);
  },

  getChucvu: (params) => {
    const url = "/user/chucvu";
    return axiosClient.get(url);
  },

  getAllUsers: (params) => {
    const url = "/user/user";
    return axiosClient.get(url);
  },

  getUser: (id) => {
    const url = `/user/user/${id}`;
    return axiosClient.get(url);
  },

  getAllUserProfiles: (params) => {
    const url = "/user/profile/";
    return axiosClient.get(url,{params});
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
