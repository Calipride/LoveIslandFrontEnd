import axios from "axios";

const BASE = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: BASE,
  headers: {
    "Content-Type": "application/json"
  }
});

// Optional: attach token automatically if present
api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function apiGet(path) {
  const res = await api.get(path);
  return res.data; // Axios already parses JSON
}

export async function apiSend(path, method, body) {
  const res = await api({
    url: path,
    method,
    data: body
  });
  return res.status === 204 ? null : res.data;
}

export default api;
