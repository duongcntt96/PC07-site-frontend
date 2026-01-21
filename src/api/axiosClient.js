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
            process.env.REACT_APP_API_URL + "/user/refresh_token",
            { refresh }
          );
          if (rp && rp.data && rp.data.access) {
            // set header with new access token
            config.headers.Authorization = `Bearer ${rp.data.access}`;
            rp.data.refresh = refresh;
            // set local token
            localStorage.setItem("secret", JSON.stringify(rp.data));
          } else {
            // Handle case where refresh token request failed or returned no access token
            console.error("Failed to refresh access token.");
            localStorage.removeItem("secret");
            window.location.replace(
              "/user/login?url=" + window.location.pathname
            );
          }
        }
      } else {
        // access token valid
        // console.log(access);
        config.headers.Authorization = `Bearer ${access}`;
      }
    }
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    return response?.data || response;
  },
  (error) => {
    if (error.response && error.response.status) {
      console.error("API Error: ", error.response.status, error.response.data);
      // Centralized error handling based on status codes can go here
      // For example, redirect to login for 401, show a generic error for 500, etc.
      console.log(error.response.status + ": " + error.response.data.detail);
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
