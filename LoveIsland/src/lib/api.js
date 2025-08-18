import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5209/api'

const api = axios.create({
  baseURL: BASE,
  withCredentials: false,
  timeout: 20000,
})


api.interceptors.request.use((config) => {
  const token = localStorage.getItem('li_token')
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }

  const isFormData =
    (typeof FormData !== 'undefined') && (config.data instanceof FormData)

  if (!isFormData) {
    config.headers = config.headers || {}
    if (!config.headers['Content-Type'] && config.method !== 'get') {
      config.headers['Content-Type'] = 'application/json'
    }
  }

  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem('li_token')
      localStorage.removeItem('li_me')
    }
    return Promise.reject(err)
  }
)


export async function apiGet(path, params) {
  const res = await api.get(path, { params })
  return res.data
}

export async function apiSend(path, method = 'POST', body) {
  const res = await api.request({
    url: path,
    method,
    data: body,
  })
  return res.status === 204 ? null : res.data
}

export default api
