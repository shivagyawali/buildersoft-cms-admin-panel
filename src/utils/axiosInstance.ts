// src/utils/axiosInstance.ts
import { defaultConfig } from "@app/config/defaultConfig";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `${defaultConfig.baseUrl}`,
});

// 🔐 Add token from localStorage
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axiosInstance;
