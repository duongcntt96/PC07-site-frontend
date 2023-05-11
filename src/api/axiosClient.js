import axios from "axios";
import queryString from "query-string";
import { decode as base64_decode } from "base-64";

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  // baseURL: "http://api." + window.location.host + "/api",
  headers: {
    "content-type": "application/json",
  },
  paramsSerializer: (params) => queryString.stringify(params),
});

axiosClient.interceptors.request.use(async (config) => {
  const token = localStorage.getItem("secret");
  if (token) {
    // console.log(token);
    const { access, refresh } = JSON.parse(token);
    if (access) {
      const accessInfo = JSON.parse(base64_decode(access.split(".")[1]));
      // console.log(accessInfo);
      const now = new Date().getTime();
      if (now > accessInfo.exp * 1000) {
        console.log("access token expried");
        // refresh token
        const refreshInfo = JSON.parse(base64_decode(refresh.split(".")[1]));
        if (now > refreshInfo.exp * 1000) {
          // Clear local token
          localStorage.removeItem("secret");
          // Login require
          window.location.replace(
            "/user/login?url=" + window.location.pathname
          );
        } else {
          // get new access token
          const rp = await axios.post(
            process.env.REACT_APP_API_URL + "/user/refresh_token  ",
            { refresh }
          );
          // set header with new access token
          config.headers.Authorization = `Bearer ${rp.data.access}`;
          rp.data.refresh = refresh;
          // set local token
          localStorage.setItem("secret", JSON.stringify(rp.data));
        }
      } else {
        // access token valid
        config.headers.Authorization = `Bearer ${access}`;
      }
    }
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      // console.log(response);
      return response.data;
    }
    return response;
  },
  (error) => {
    if (error.response) {
      // console.log(error.response.data);
      // console.log(error.response.status);
      // console.log(error.response.headers);
      if (error.response.status === 401)
        window.location.replace("/user/login?url=" + window.location.pathname);
    }
    return error.response;
    // throw error;
  }
);

export default axiosClient;
