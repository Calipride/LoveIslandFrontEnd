// src/lib/api.js
import axios from 'axios'

// Fallback to your local API if VITE_API_URL isn't set.
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5209/api'

const api = axios.create({
  baseURL: BASE,
  // DON'T hard-set Content-Type here; it breaks FormData uploads.
  // headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
  timeout: 20000,
})

// --- Attach token automatically ---
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('li_token')
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }

  // If we're sending FormData, let the browser set the boundary header.
  const isFormData =
    (typeof FormData !== 'undefined') && (config.data instanceof FormData)

  if (!isFormData) {
    // For JSON requests, ensure JSON header.
    // (Axios will stringify plain objects automatically)
    config.headers = config.headers || {}
    if (!config.headers['Content-Type'] && config.method !== 'get') {
      config.headers['Content-Type'] = 'application/json'
    }
  }

  return config
})

// --- Handle 401 globally (optional redirect if you want) ---
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem('li_token')
      localStorage.removeItem('li_me')
      // e.g. window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// ---- Helpers you call from components/stores ----
export async function apiGet(path, params) {
  const res = await api.get(path, { params })
  return res.data
}

// For JSON bodies or FormData (uploads). Just pass body as a plain object or FormData.
export async function apiSend(path, method = 'POST', body) {
  const res = await api.request({
    url: path,
    method,
    data: body,
  })
  return res.status === 204 ? null : res.data
}

export default api
