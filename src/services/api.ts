import axios from "axios";
import { debug, info } from "../utils/logger";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  debug("api:req", `${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
  return config;
});

api.interceptors.response.use(
  (response) => {
    debug(
      "api:res",
      `${response.config.method?.toUpperCase()} ${response.config.baseURL}${response.config.url} -> ${response.status}`
    );
    return response;
  },
  (err) => {
    const cfg = err?.config || {};
    const status = err?.response?.status;
    info(
      "api:res:error",
      `${cfg.method?.toUpperCase?.() || ""} ${cfg.baseURL || ""}${cfg.url || ""} -> ${status}`,
      err?.response?.data || err?.message
    );
    return Promise.reject(err);
  }
);

export default api;
