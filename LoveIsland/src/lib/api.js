import axios from 'axios'
import router from '@/router'

const BASE = import.meta.env.VITE_API_URL

const api = axios.create({
  baseURL: BASE,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
})

// attach token
api.interceptors.request.use((config) => {
  const t = localStorage.getItem('li_token')
  if (t) config.headers.Authorization = `Bearer ${t}`
  return config
})

// handle 401
api.interceptors.response.use(
  res => res,
  err => {
    if (err?.response?.status === 401) {
      localStorage.removeItem('li_token')
      localStorage.removeItem('li_me')
      if (router.currentRoute.value.name !== 'login') {
        router.push({ name:'login', query:{ redirect: router.currentRoute.value.fullPath } })
      }
    }
    return Promise.reject(err)
  }
)

export async function apiGet(path, config) {
  const { data } = await api.get(path, config)
  return data
}

export async function apiSend(path, method='POST', body=null, config={}) {
  const res = await api.request({ url:path, method, data: body, ...config })
  return res.status === 204 ? null : res.data
}

// special: multipart upload
export async function apiUpload(path, file) {
  const fd = new FormData()
  fd.append('file', file)
  const res = await api.post(path, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
  return res.data
}

export default api
