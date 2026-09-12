import axios from "axios";

export const BACKEND_URL = "https://vehicle-rental-platform-ptgu.onrender.com";

const API = axios.create({
  baseURL: `${BACKEND_URL}/api`
});

// Request interceptor to dynamically inject the JWT token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;