import axios from "axios";
import queryString from "query-string";
import { decode as base64_decode } from "base-64";

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "content-type": "application/json",
  },
  paramsSerializer: (params) => queryString.stringify(params),
});

axiosClient.interceptors.request.use(async (config) => {
  const token = localStorage.getItem("secret");
  if (token) {
    console.log(token);
    const { access, refresh } = JSON.parse(token);
    if (access) {
      const accessInfo = JSON.parse(base64_decode(access.split(".")[1]));
      console.log(accessInfo);
      const now = new Date().getTime();
      if (now > accessInfo.exp * 1000) {
        console.log("access token expried");
        // refresh token
        const refreshInfo = JSON.parse(base64_decode(refresh.split(".")[1]));
        if (now > refreshInfo.exp * 1000) {
          console.log("refresh token expried, Login require");
        } else {
          console.log("refresh token valid");
          // get new access token here
          const rp = await axios.post(
            process.env.REACT_APP_API_URL + "/token/refresh/",
            { refresh }
          );
          // set header with access token
          config.headers.Authorization = `Bearer ${rp.data.access}`;
          rp.data.refresh = refresh;
          localStorage.setItem("secret", JSON.stringify(rp.data));
        }
      } else {
        console.log("access token valid");
        config.headers.Authorization = `Bearer ${access}`;
      }
    }
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    console.log(error);
    throw error;
  }
);

export default axiosClient;
