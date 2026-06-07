// src/services/api.js
import axios from "axios";

const apiRoot = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(
  /\/$/,
  ""
);

const api = axios.create({
  baseURL: apiRoot.endsWith("/api") ? apiRoot : `${apiRoot}/api`,
  withCredentials: true,
});

export default api;
